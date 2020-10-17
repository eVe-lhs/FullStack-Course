import axios from "axios";

const baseURL = "http://localhost:3001/anecdotes";
const getId = () => (100000 * Math.random()).toFixed(0);

const getAll = async () => {
  const response = await axios.get(baseURL);
  return response.data;
};
const createNew = async (content) => {
  const newObject = {
    content,
    id: getId(),
    votes: 0,
  };
  const response = await axios.post(baseURL, newObject);
  return response.data;
};
const vote = async (anecdote, id) => {
  const response = await axios.put(`${baseURL}/${id}`, anecdote);
  return response.data;
};
export default { getAll, createNew, vote };
