import React, { useState, useEffect } from "react";
import axios from "axios";
const api_key = "12776d43e8c5cb0435dfc560f5b98c78";
const Find = ({ onChange, value }) => {
  return (
    <div>
      <label>find countries</label>
      <input onChange={onChange} value={value} />
    </div>
  );
};
const ShowDetail = ({ country }) => {
  if (country === null) {
    return null;
  }
  if (country.name === "Myanmar") {
    country.capital = "Yangon";
  }
  return (
    <div key={country.name}>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      {country.languages.map((language) => (
        <li key={language.name}>{language.name}</li>
      ))}
      <img src={country.flag} alt={country.name} width="100px" height="100px" />
      <ShowWeather country={country} />
    </div>
  );
};
const ShowWeather = ({ country }) => {
  const params = {
    access_key: api_key,
    query: country.capital,
  };
  const [weather, setWeather] = useState();
  useEffect(() => {
    axios
      .get("http://api.weatherstack.com/current", { params })
      .then((response) => {
        setWeather(response.data);
      })
      .catch();
  }, []);
  return (
    <div key={country.capital}>
      <h1>Weather in {country.capital}</h1>
      {weather ? (
        <div>
          <strong>temperature:</strong>
          {weather.current.temperature}
          <div>
            <img
              src={weather.current.weather_icons}
              alt={weather.current.weather_descriptions}
            />
          </div>
          <strong>wind:</strong>
          {weather.current.wind_speed} mph direction {weather.current.wind_dir}
        </div>
      ) : (
        <div>Loading</div>
      )}
      <div>{}</div>
    </div>
  );
};
const Countries = ({ countries }) => {
  const [countrySelected, setCountrySelected] = useState(null);
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length === 1) {
    return (
      <div>
        {countries.map((country) => (
          <ShowDetail country={country} key={country.name} />
        ))}
      </div>
    );
  } else {
    return (
      <div>
        {countries.map((country) => (
          <div key={country.name}>
            {country.name}
            <button onClick={() => setCountrySelected(country)}>show</button>
          </div>
        ))}
        <ShowDetail country={countrySelected} />
      </div>
    );
  }
};
const App = () => {
  const [find, setFind] = useState("");
  const [countries, setCountries] = useState([]);
  let countriesFiltered = [];
  if (find === "") {
    countriesFiltered = [];
  } else {
    countriesFiltered = countries.filter((country) =>
      country.name.toLowerCase().includes(find.toLowerCase())
    );
  }

  useEffect(() => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then((response) => setCountries(response.data));
  }, []);
  const handleOnChange = (e) => {
    setFind(e.target.value);
  };
  return (
    <div>
      <Find onChange={handleOnChange} value={find} />
      <Countries countries={countriesFiltered} />
    </div>
  );
};

export default App;
