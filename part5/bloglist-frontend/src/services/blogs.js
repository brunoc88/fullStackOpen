import axios from 'axios'
//const baseUrl = '/api/blogs'
const baseUrl = 'http://localhost:3000/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


const create = async (id, newObject) => {
  if (!token) {
    throw new Error("No token found, please log in first");
  }

  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.post(`${baseUrl}/${id}`, newObject, config);
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error.response?.data || error.message);
    throw error;
  }
};


const update = async (id, updateObject) => {  
  if (!token) {
    throw new Error("No token found, please log in first");
  }

  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.put(`${baseUrl}/${id}`, updateObject, config);
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error.response?.data || error.message);
    throw error;
  }
};




export default { getAll, create, setToken, update }