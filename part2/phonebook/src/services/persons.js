import axios from 'axios'
//const urlBase = 'http://localhost:3001/persons' we not goint to use it anymore, because we need the new one for part3
const urlBase = 'api/persons'

export const getAll = () =>{
    return axios.get(urlBase).then(response => response.data);
}

export const create = (newPerson) =>{
    return axios.post(urlBase, newPerson).then(response => response.data);
}

export const deletePerson = (id) => {
    return axios.delete(`${urlBase}/${id}`).then(response => response.data);
}

export const updatePhoneNumber = (id, updatedPerson) => {
    return axios.put(`${urlBase}/${id}`, updatedPerson).then(response => response.data);
}


