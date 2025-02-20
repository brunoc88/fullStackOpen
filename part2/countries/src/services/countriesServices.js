import axios from 'axios';
const urlBase = 'https://studies.cs.helsinki.fi/restcountries/api/all';

const getAll = () =>{
    return axios.get(urlBase).then(response => response.data);
}

export {getAll};