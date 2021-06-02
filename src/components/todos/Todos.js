import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import axios from "axios";
import { useQuery } from "@apollo/client";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import { PageHeader } from "@codedrops/react-ui";
import "./Todos.scss";
import { GET_ALL_TASKS } from "../../graphql/queries";

const Todos = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoType, setTodoType] = useState("WEEKLY");
  const { loading, error, data } = useQuery(GET_ALL_TASKS);

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    const {
      data: { todos },
    } = await axios.get(`todos`);
    setTodoList(todos);
  };

  return (
    <section id="todos">
      <PageHeader
        title={"Todos"}
        actions={[
          <Radio.Group
            key="todo-type"
            className="mr"
            defaultValue={todoType}
            buttonStyle="solid"
            onChange={(e) => setTodoType(e.target.value)}
          >
            <Radio.Button value="SINGLE">SINGLE</Radio.Button>
            <Radio.Button value="WEEKLY">WEEKLY</Radio.Button>
          </Radio.Group>,
          <AddTodo key="add-todo" fetchTodoList={fetchTodoList} />,
        ]}
      />

      <TodoList
        todoList={todoList.filter((todo) => todo.type === todoType)}
        fetchTodoList={fetchTodoList}
        type={todoType}
      />
    </section>
  );
};

export default Todos;
