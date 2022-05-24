import classes from "./WeatherCardContent.module.css";
import { CardContent, CircularProgress } from "@mui/material";

export default function WeatherCardContent(props) {
  const { data } = props.weather;

  // Näytetään spinneriä kunnes data ollaan saatu.
  if (!props.weather.dataReceived) {
    return (
      <CardContent className={classes["content-centered"]}>
        <CircularProgress />
      </CardContent>
    );
  }

  // Näytetään virheilmoitus.
  if (props.weather.error) {
    return (
      <CardContent className={classes["content-centered"]}>
        <p>{props.weather.error}</p>
      </CardContent>
    );
  }

  // Datan saatuaan näytetään säätila.
  return (
    <CardContent sx={{ color: "#333" }}>
      <img src={data.icon} alt="Säätilaa kuvaava ikoni." />
      <p className={classes.degrees}>{data.degrees}ºC</p>
      <p className={classes.city}>{data.city}</p>
      <p className={classes.description}>{data.description}</p>
    </CardContent>
  );
}
