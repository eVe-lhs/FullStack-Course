import axios from "axios";
<<<<<<< HEAD
const baseURL = "/api/persons";
=======
const baseURL = "http://localhost:3001/api/persons";
>>>>>>> 73c46bbac4958629505aaf9ab20aabae3eacbd91

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
