import anecdoteServices from "../services/anecdoteServices";

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case "VOTE": {
      const id = action.data.id;
      return state.map((anec) => (anec.id === id ? action.data : anec));
    }
    case "CREATE":
      return [...state, action.data];
    case "INIT_ANECS":
      return action.data;
    default:
      return state;
  }
};
export const vote = (anecdote, id) => {
  return async (dispatch) => {
    const afterVoted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };
    const data = await anecdoteServices.vote(afterVoted, id);
    dispatch({
      type: "VOTE",
      data,
    });
  };
};
export const add = (content) => {
  return async (dispatch) => {
    const data = await anecdoteServices.createNew(content);
    dispatch({
      type: "CREATE",
      data,
    });
  };
};

export const initAnecs = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteServices.getAll();
    dispatch({
      type: "INIT_ANECS",
      data: anecdotes,
    });
  };
};
export default anecdoteReducer;
