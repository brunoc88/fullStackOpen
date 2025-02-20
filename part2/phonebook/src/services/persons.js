import axios from 'axios'
const urlBase = 'http://localhost:3001/persons'

export const getAll = () =>{
    return axios.get(urlBase).then(response => response.data);
}

export const create = (newPerson) =>{
    return axios.post(urlBase, newPerson).then(response => response.data);
}

export const deletePerson = (id) => {
    return axios.delete(`${urlBase}/${id}`).then(response => response.data);
}


