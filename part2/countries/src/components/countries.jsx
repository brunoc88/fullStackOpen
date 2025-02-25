import { useState, useEffect } from "react";
import { getWeather } from "../services/countriesServices";

const Filter = ({ handler }) => {
  return (
    <div>
      find countries <input onChange={handler} />
    </div>
  );
};

const Countries = ({ list, setSelectedCountry, selectedCountry }) => {
    
    if (selectedCountry) {
      return <Country country={selectedCountry} />;
    }
  
    
    if (list.length === 1) {
      return <Country country={list[0]} />;
    }
  
    
    if (list.length > 10 ) {
      return <div>Too many matches, specify another filter</div>;
    }
  
    return (
      <div>
        {list.map((country) => (
          <div key={country.name.common}>
            <p>
              {country.name.common}{" "}
              <button onClick={() => setSelectedCountry(country)}>
                show
              </button>
            </p>
          </div>
        ))}
      </div>
    );
  };
  

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeather(country.capital[0])
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather:", error));
  }, [country.capital]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />

      {weather && (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`Weather icon`}
          />
          <p>{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export { Filter, Countries };
