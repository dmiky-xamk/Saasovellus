import classes from "./Home.module.css";
import { Button, Card, TextField } from "@mui/material";
import WeatherCardContent from "../components/WeatherCardContent";
import { useState } from "react";

export default function Home(props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);

  const isCityNameEmpty = () => {
    if (!city.trim()) {
      setError("Anna paikkakunta.");
      return true;
    }

    setError(null);
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isCityNameEmpty()) return;

    // Luodaan sisäinen muuttuja, jotta käyttäjän antamaa syötettä ei mennä muokkaamaan.
    let fixedCity = city.toLowerCase();

    // LÄHDE: https://bobbyhadz.com/blog/javascript-replace-umlaut-characters
    const replaceUmlauts = (str) => {
      return str
        .replace(/\u00e4/g, "a")
        .replace(/\u00f6/g, "o")
        .replace(/\u00e5/g, "o");
    };

    if (
      fixedCity.includes("å") ||
      fixedCity.includes("ä") ||
      fixedCity.includes("ö")
    ) {
      fixedCity = replaceUmlauts(fixedCity);
    }

    props.onCityChange(fixedCity);
  };

  return (
    <section className={classes["section-home"]}>
      <Card
        sx={{
          minHeight: 250,
          margin: "0 auto 1.2rem",
          backgroundColor: "#a5d8ff",
        }}
      >
        <WeatherCardContent weather={props.weather} />
      </Card>
      <form className={classes["home-form"]} onSubmit={handleSubmit}>
        <TextField
          sx={{
            marginBottom: 0.8,
          }}
          className={classes["home-city-input"]}
          name="city"
          id="city"
          label="Paikkakunta"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={Boolean(error)}
          helperText={error}
        />
        <Button variant="contained" type="submit">
          Vaihda kaupunki
        </Button>
      </form>
    </section>
  );
}
