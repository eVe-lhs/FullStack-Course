import React, { useState } from "react";
import Notification from "./notification";
import { connect } from "react-redux";
import { login } from "../reducers/userReducer";
import { setNoti } from "../reducers/notificationReducer";
import { Redirect } from "react-router-dom";

const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onUsernameChange = ({ target }) => {
    setUsername(target.value);
  };
  const onPasswordChange = ({ target }) => {
    setPassword(target.value);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await props.login(username, password);
      setUsername("");
      setPassword("");
    } catch (err) {
      props.setNoti(
        err.response.data.error,
        5,
        props.notification.timeout,
        "error"
      );
    }
  };
  return props.user ? (
    <Redirect to="/" />
  ) : (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin} id="login_form">
        <div>
          <Notification />
          <label>username</label>
          <input
            type="text"
            onChange={onUsernameChange}
            value={username}
            id="username"
          />
        </div>
        <div>
          <label>password</label>
          <input
            type="password"
            onChange={onPasswordChange}
            value={password}
            id="password"
          />
          <button type="submit" id="login_button">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = {
  login,
  setNoti,
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
