import userService from "../services/users";
const usersReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_USERS":
      return action.users;
    default:
      return state;
  }
};
export const getUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch({
      type: "GET_USERS",
      users,
    });
  };
};
export default usersReducer;
