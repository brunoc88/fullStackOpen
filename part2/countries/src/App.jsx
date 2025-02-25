import { useState, useEffect } from "react";
import { getAll } from "./services/countriesServices";
import { Filter, Countries } from "./components/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null); 

  const handleCountry = (event) => {
    const value = event.target.value.toLowerCase();
    setFilter(value);
    setSelectedCountry(null); 
  };

  const countriesFilter = filter
    ? countries.filter((value) =>
        value.name.common.toLowerCase().includes(filter)
      )
    : [];

  useEffect(() => {
    getAll()
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div>
      <Filter handler={handleCountry} />
      <Countries
        list={countriesFilter}
        setSelectedCountry={setSelectedCountry}
        selectedCountry={selectedCountry}
      />
    </div>
  );
};

export default App;
