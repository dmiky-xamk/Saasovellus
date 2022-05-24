import classes from "./Forecast.module.css";
import { Card, CardContent, CircularProgress } from "@mui/material";

export default function Forecast(props) {
  const { forecastData } = props.weather;

  // * timeOfDay: "night", "day"
  const getForecastJSX = (fcast, timeOfDay) => {
    // Muotoillaan tunnit
    const hours = `${fcast[timeOfDay].hours}:00`;

    return (
      <div>
        <p className={classes["forecast-time-of-day"]}>{hours}</p>
        <img src={fcast[timeOfDay].icon} alt="Säätilaa kuvaava ikoni." />
        <p
          className={classes[`forecast-temp`]}
        >{`${fcast[timeOfDay].temp}ºC`}</p>
        <p className={classes[`forecast-desc`]}>
          {fcast[timeOfDay].description}
        </p>
      </div>
    );
  };

  const forecast = forecastData?.map((forecast) => {
    const nightData = forecast?.night && getForecastJSX(forecast, "night");
    const dayData = forecast?.day && getForecastJSX(forecast, "day");

    return (
      <Card
        key={Math.random().toString()}
        sx={{
          minHeight: 200,
          minWidth: 450,
          margin: "0 auto 1.2rem",
          backgroundColor: "#a5d8ff",
        }}
      >
        <CardContent>
          <div className={classes["forecast-grid"]}>
            <h2 className={classes["forecast-day"]}>{forecast.dayName}</h2>
            {nightData || <div></div>}
            {dayData || <div></div>}
          </div>
        </CardContent>
      </Card>
    );
  });

  // Näytetään spinneriä kunnes data ollaan saatu.
  if (!props.weather.dataReceived) {
    return (
      <CardContent className={classes["content-centered"]}>
        <CircularProgress />
      </CardContent>
    );
  }

  if (props.weather.error) {
    return (
      <CardContent className={classes["content-centered"]}>
        <p>{props.weather.error}</p>
      </CardContent>
    );
  }

  return <section className={classes["section-forecast"]}>{forecast}</section>;
}
