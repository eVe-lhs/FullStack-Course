import blogService from "../services/blogs";
import loginService from "../services/login";
const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.user;
    default:
      return state;
  }
};
export const login = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({ username, password });
    await blogService.setToken(user.token);
    window.localStorage.setItem("loggedUser", JSON.stringify(user));
    dispatch({
      type: "SET_USER",
      user,
    });
  };
};

export const setUser = (user) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_USER",
      user,
    });
  };
};

export default userReducer;
