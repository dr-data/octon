/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";
import "./Expenses.scss";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import Resize from "../utils/Resize";
import { sendAppNotification, setAppLoading } from "../../store/app/actions";
import { Icon, PageHeader } from "@codedrops/react-ui";
import { calculateTotal } from "./util";

const { MonthPicker } = DatePicker;

const Expenses = ({ sendAppNotification, setAppLoading }) => {
  const [expenseList, setExpenseList] = useState([]);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState(moment());
  const [
    expenseListVisibilityStatus,
    setExpenseListVisibilityStatus,
  ] = useState(false);

  useEffect(() => {
    fetchExpenseByMonth();
  }, [date]);

  const fetchExpenseByMonth = async () => {
    setAppLoading(true);
    try {
      const {
        data: { expenses },
      } = await axios.get(`/expenses/${date.month() + 1}?year=${date.year()}`);
      setExpenseList(expenses);
      setTotal(calculateTotal(expenses));
    } catch (err) {
      sendAppNotification({
        message: err.response.data || err.message,
      });
    } finally {
      setAppLoading(false);
    }
  };

  return (
    <section id="expenses">
      <div className="card">
        <PageHeader
          title={
            <h3>
              <span className="underline">Expenses</span>
            </h3>
          }
          actions={
            <div className="flex center">
              <MonthPicker
                key="month-picker"
                style={{ width: "75px" }}
                allowClear={false}
                format="MMM, YY"
                onChange={(date) => setDate(date)}
                value={date}
                placeholder="Select month"
              />
              <span style={{ margin: "0 8px" }} key="total" className="total">
                Rs/- {total}
              </span>
              <Icon
                className="wallet-icon"
                key="list-expenses"
                onClick={() => setExpenseListVisibilityStatus(true)}
                type="wallet"
              />
            </div>
          }
        />
        <div className="divider"></div>

        <AddExpense
          setAppLoading={setAppLoading}
          fetchExpenseByMonth={fetchExpenseByMonth}
          mode="ADD"
        />
      </div>

      <Resize
        modalProps={{
          visible: expenseListVisibilityStatus,
          setVisibility: setExpenseListVisibilityStatus,
          title: "",
          width: 380,
          onCancel: () => setExpenseListVisibilityStatus(false),
          footer: null,
        }}
        component={ExpenseList}
        list={expenseList}
        fetchExpenseByMonth={fetchExpenseByMonth}
        date={date}
        setAppLoading={setAppLoading}
      />
    </section>
  );
};

const mapActionsToProps = {
  sendAppNotification,
  setAppLoading,
};

export default connect(null, mapActionsToProps)(Expenses);
