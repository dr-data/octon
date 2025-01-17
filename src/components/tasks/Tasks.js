import React, { useState, useEffect } from "react";
import { Modal, PageHeader, Input, Radio, Empty } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import AddTask from "./AddTask";
import "./Tasks.scss";
import { GET_ALL_TASKS } from "../../graphql/queries";
import _ from "lodash";
import { STAMP_TASK, DELETE_TASK } from "../../graphql/mutations";
import { connect } from "react-redux";
import Task from "./Task";
import moment from "moment";
import { setAppLoading } from "../../store/actions";

const Tasks = ({ setAppLoading }) => {
  const { loading, data } = useQuery(GET_ALL_TASKS);
  const [stampTask] = useMutation(STAMP_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  useEffect(() => {
    setAppLoading(loading);
  }, [loading]);

  const [taskObj, setTaskObj] = useState({});

  const todoList = _.get(data, "octon.getAllTasks", []);

  const markTodo = async (task, extra = {}) => {
    setAppLoading(true);
    const { _id } = task;
    const { actionType } = extra;
    let input = { _id, actionType };

    if (actionType === "SUBTASK") {
      const { message, action, date, subTaskId } = extra;
      input = {
        ...input,
        date,
        action,
        subTaskId,
        message,
        actionType,
      };
    } else {
      const { status } = task;
      input = {
        ...input,
        actionType: "TASK",
        action: status === "COMPLETED" ? "UNMARK" : "MARK",
        date: moment().toISOString(),
      };
    }

    stampTask({
      variables: { input },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    });
    setTaskObj({});
    setAppLoading(false);
  };

  const handleDeleteTask = async (_id) => {
    setAppLoading(true);
    await deleteTask({
      variables: { input: { _id } },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    });
    setAppLoading(false);
  };

  return (
    <section id="tasks">
      <PageHeader
        className="page-header"
        ghost={false}
        onBack={null}
        title="Tasks"
        extra={[<AddTask key="add-todo" />]}
      />
      {todoList.length ? (
        todoList.map((task) => (
          <Task
            key={task._id}
            task={task}
            markTodo={markTodo}
            handleDeleteTask={handleDeleteTask}
            setTaskObj={setTaskObj}
          />
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      <TaskDetail
        taskObj={taskObj}
        setTaskObj={setTaskObj}
        markTodo={markTodo}
      />
    </section>
  );
};

const TaskDetail = ({ taskObj, setTaskObj, markTodo }) => {
  const [temp, setTemp] = useState({});

  useEffect(() => {
    if (taskObj.visible)
      setTemp({
        status: !!_.get(taskObj, "subTask") ? "MARK" : "UNMARK",
        message: _.get(taskObj, "subTask.message", ""),
      });
  }, [taskObj]);

  const handleOk = () =>
    markTodo(taskObj.task, {
      message: temp.message,
      action: temp.status,
      date: taskObj.date,
      subTaskId: _.get(taskObj, "subTask._id"),
      actionType: "SUBTASK",
    });

  const taskName = _.get(taskObj, "task.content");
  const taskType = _.get(taskObj, "task.type");
  const date = moment(_.get(taskObj, "date")).format("DD MMM, YYYY");

  return (
    <Modal
      wrapClassName="react-ui"
      width={320}
      visible={taskObj.date}
      title={taskType}
      onCancel={() => setTaskObj({})}
      onOk={handleOk}
      okText="Save"
    >
      <div className="flex column" style={{ gap: "10px" }}>
        <div className="task">{taskName}</div>
        <div className="task">{date}</div>

        <Input
          placeholder="Message"
          value={temp.message}
          onChange={({ target: { value } }) =>
            setTemp((prev) => ({ ...prev, message: value }))
          }
        />

        <Radio.Group
          value={temp.status}
          buttonStyle="solid"
          onChange={(e) =>
            setTemp((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <Radio.Button value="MARK">Mark</Radio.Button>
          <Radio.Button value="UNMARK">Unmark</Radio.Button>
        </Radio.Group>
      </div>
    </Modal>
  );
};

const mapActionsToProps = {
  setAppLoading,
};

export default connect(null, mapActionsToProps)(Tasks);
