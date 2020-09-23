import axios from "axios";
const baseURL = "/api/persons";

const getNumbers = () => axios.get(baseURL).then((response) => response.data);
const addNew = (newObject) =>
  axios.post(baseURL, newObject).then((response) => response.data);
const update = (id, newObject) =>
  axios.put(`${baseURL}/${id}`, newObject).then((response) => response.data);
const del = (id) => axios.delete(`${baseURL}/${id}`);
export default {
  getNumbers,
  addNew,
  update,
  del,
};
