const notificationReducer = (state = "", action) => {
  switch (action.type) {
    case "SETNOTI": {
      return action.data;
    }
    case "RESETNOTI":
      return "";
    default:
      return state;
  }
};

export const setNoti = (notification, time, timeout) => {
  return async (dispatch) => {
    const countdown = time * 1000;
    clearTimeout(timeout);
    timeout = await setTimeout(() => {
      dispatch({ type: "RESETNOTI" });
    }, countdown);
    dispatch({
      type: "SETNOTI",
      data: {
        notification,
        timeout,
      },
    });
  };
};

export default notificationReducer;
