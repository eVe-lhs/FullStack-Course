const filterReducer = (state = "", action) => {
  switch (action.type) {
    case "FILTER_VALUE":
      return action.filter;
    default:
      return state;
  }
};

export const filterChange = (filter) => {
  return {
    type: "FILTER_VALUE",
    filter,
  };
};
export default filterReducer;
