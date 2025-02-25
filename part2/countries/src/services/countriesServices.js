import axios from 'axios';
const urlBase = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;


const getAll = () =>{
    return axios.get(urlBase).then(response => response.data);
}

const getWeather = (capital) =>{
    const url = `${weatherBaseUrl}?q=${capital}&appid=${apiKey}&units=metric`;
    return axios.get(url).then(response => response.data);
}

export {getAll, getWeather};