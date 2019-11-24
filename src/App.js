/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { Spin } from "antd";
import axios from "axios";
import { connect } from 'react-redux';

import "antd/dist/antd.css";
import "./App.scss";

import Header from "./layouts/Header";

import PrivateRoute from "./components/auth/PrivateRoute";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PageNotFound from "./components/PageNotFound";
import Home from "./components/Home";
import Expenses from "./components/expense/Expenses";
import Todos from "./components/todos/Todos";
import Timeline from "./components/timeline/Timeline";
import Posts from "./components/posts/Posts";

import { getToken, isLoggedIn } from "./authService";
import config from "./config";

import { getSession } from './store/app/selectors';
import { setSession } from './store/app/actions';

axios.defaults.baseURL = config.SERVER_URL;

const App = ({ session, setSession }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAccountActive = async () => {
      if (isLoggedIn()) {
        try {
          const token = getToken();
          await axios.post(`/auth/account-status`, { token });
          setSession({ loggedIn: true, info: "ON_LOAD" });
        } catch (err) {
          console.log(err);
        }
      }
    };
    isAccountActive();
  }, []);

  useEffect(() => {
    if (session) {
      const setAxiosHeaderToken = () =>
        (axios.defaults.headers.common["authorization"] = getToken());
      setAxiosHeaderToken();
    }
    setTimeout(() => setLoading(false), 1000);
  }, [session]);

  return (
    <div className="app">
      <Header />
      {loading ? (
        <div className="content">
          <Spin />
        </div>
      ) : (
          <div className="content">
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/expenses" component={Expenses} />
              <PrivateRoute exact path="/todos" component={Todos} />
              <PrivateRoute exact path="/timeline" component={Timeline} />
              <PrivateRoute exact path="/posts" component={Posts} />
              <Route exact path="/" component={Home} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
        )}
    </div>
  );
};

const mapStateToProps = state => ({ session: getSession(state) });

const mapDispatchToProps = ({ setSession });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
