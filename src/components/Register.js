import React, { Component, Fragment } from "react";
import { Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";

import axios from "axios";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      password: "",
      email: "",
      redirect: false
    };
  }

  handleInput = key => e => this.setState({ [key]: e.target.value });

  handleRegister = async () => {
    const { name, username, password, email } = this.state;
    try {
      await axios.post("/auth/register", {
        username,
        password,
        name,
        email
      });

      this.setState({ redirect: true });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    return (
      <Fragment>
        <form>
          <Input
            className="input"
            value={this.state.name}
            onChange={this.handleInput("name")}
            placeholder="Name"
          />
          <Input
            className="input"
            value={this.state.email}
            onChange={this.handleInput("email")}
            placeholder="Email"
          />
          <Input
            className="input"
            value={this.state.username}
            onChange={this.handleInput("username")}
            placeholder="Username"
          />
          <Input.Password
            className="input"
            value={this.state.password}
            onChange={this.handleInput("password")}
            placeholder="Password"
          />
          <br />
          <Button
            className="input"
            type="primary"
            onClick={this.handleRegister}
          >
            Register
          </Button>
        </form>
      </Fragment>
    );
  }
}
