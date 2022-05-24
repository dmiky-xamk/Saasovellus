import classes from "./Navigation.module.css";
import { NavLink } from "react-router-dom";

export default function Navigation() {
  // Linkille tulee eri tyyli sen mukaan, onko käyttäjä linkille ohjaamalla sivulla vai ei
  const getLinkStyle = ({ isActive }) => {
    const activeClassName = classes["nav-link--active"];
    const inactiveClassName = classes["nav-link"];

    if (isActive) {
      return activeClassName;
    }

    return inactiveClassName;
  };

  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul className={classes["nav-list"]}>
          <li>
            <NavLink className={getLinkStyle} to="/" end>
              Tämän hetken sää
            </NavLink>
          </li>
          <li>
            <NavLink className={getLinkStyle} to="ennuste">
              Tulevien päivien sää
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
