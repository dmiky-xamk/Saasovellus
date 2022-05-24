import "@fontsource/roboto";
import { Fragment, useState } from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import Layout from "./components/Layout/Layout";

const FETCH_ERRORS = Object.freeze({
  CITY_NOT_FOUND: "404",
});

const FORECAST_TIMES = Object.freeze({
  DAY: 15,
  NIGHT: 3,
});

function App() {
  const getJSON = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      return data;
    } catch (error) {
      // Kokeilin hakua ilman nettiä ja sain tämän virheilmoituksen.
      // Päätin huvikseen renderöidä tämänkin.
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Tietojen hakeminen palvelimelta epäonnistui. Tarkista internet-yhteytesi."
        );
      }

      throw error;
    }
  };

  // Filteröidään vain ajankohdat 3:00 sekä 18:00
  const filterForecast = (forecastData) => {
    const isDayOrNight = (dateUTC) => {
      const date = new Date(dateUTC).getHours();

      return date === FORECAST_TIMES.NIGHT || date === FORECAST_TIMES.DAY;
    };

    const { list } = forecastData;

    return list.filter((weather) => isDayOrNight(weather.dt_txt));
  };

  const formatForecast = (forecastData) => {
    const getDayName = (dayNumber) => {
      return ["SU", "MA", "TI", "KE", "TO", "PE", "LA"][dayNumber];
    };

    let forecastDays = {};

    forecastData.forEach((forecast) => {
      // Palauttaa Suomen ajassa (GMT + 3, kesäaika)
      const dayLocalTime = new Date(forecast.dt * 1000);
      const dayHours = dayLocalTime.getHours();
      const dayNumber = dayLocalTime.getDay();
      const dayName = getDayName(dayNumber);

      const hours = new Date(forecast.dt_txt).getHours();

      const { description, icon } = forecast.weather[0];
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      const timeOfDay = hours === FORECAST_TIMES.DAY ? "day" : "night";

      const dayData = {
        temp: forecast.main.temp.toFixed(1),
        icon: iconUrl,
        description: description,
        hours: dayHours,
      };

      forecastDays = {
        ...forecastDays,
        [dayName]: { ...forecastDays[dayName], [timeOfDay]: dayData },
      };
    });
    // [ Object { dayName: "xx", night: {...}, day: {...} } ]
    const formattedForecast = [];

    for (const [key, value] of Object.entries(forecastDays)) {
      formattedForecast.push({ dayName: key, ...value });
    }

    return formattedForecast;
  };

  const handleGetWeather = async (city) => {
    try {
      // Haetaan molemmat samaan aikaan.
      const [weatherData, forecastData] = await Promise.all([
        getJSON(`https://xamkbit.herokuapp.com/saatilanne/${city}`),
        getJSON(`https://xamkbit.herokuapp.com/saaennuste/${city}`),
      ]);

      if (weatherData.cod === FETCH_ERRORS.CITY_NOT_FOUND) {
        throw new Error("Hakemaasi paikkakuntaa ei löytynyt.");
      }

      const filteredForecast = filterForecast(forecastData);
      const formattedForecast = formatForecast(filteredForecast);

      const { description, icon } = weatherData.weather[0];

      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      const weather = {
        city: weatherData.name,
        degrees: weatherData.main.temp.toFixed(1),
        description: description,
        icon: iconUrl,
      };

      setWeather({
        dataReceived: true,
        data: weather,
        forecastData: formattedForecast,
        error: null,
      });
    } catch (error) {
      setWeather({
        dataReceived: true,
        data: null,
        forecastData: null,
        error: error.message,
      });
    }
  };

  const [weather, setWeather] = useState(() => {
    return handleGetWeather("Mikkeli");
  });

  return (
    <Fragment>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Home weather={weather} onCityChange={handleGetWeather} />}
          />
          <Route path="ennuste" element={<Forecast weather={weather} />} />
        </Routes>
      </Layout>
    </Fragment>
  );
}

export default App;
