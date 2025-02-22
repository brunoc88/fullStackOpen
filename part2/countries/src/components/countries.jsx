import { useState } from "react";

const Filter = ({ handler }) => {
    return (
        <div>
            find countries <input onChange={handler} />
        </div>
    );
};

const Countries = ({ list }) => {
    const [selectedCountry, setSelectedCountry] = useState(null);

    if (selectedCountry) {
        return <Country country={selectedCountry} />;
    }

    if (list.length === 1) {
        return <Country country={list[0]} />;
    }
    if (list.length > 10) {
        return <div>Too many matches, specify another filter</div>;
    }
    
    return (
        <div>
            {list.map(country => (
                <div key={country.name.common}>
                    <p>
                    {country.name.common}{" "}
                    <button onClick={() => setSelectedCountry(country)}>show</button>
                    </p>
                </div>
            ))}
        </div>
    );
};

const Country = ({ country }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital[0]}</p>
            <p>Area {country.area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(language => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`}/>
        </div>
    );
};

export { Filter, Countries };
