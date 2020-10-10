import React from "react";

const loginForm = ({
  handleLogin,
  errormessage,
  onUsernameChange,
  onPasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin} id="login_form">
        <div>
          {errormessage === "" ? null : (
            <div className="error">{errormessage}</div>
          )}
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
export default loginForm;
