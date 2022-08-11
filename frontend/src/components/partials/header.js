import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Header = () => {
  return (

    <div id="headerContainer" className="partial">

      <Helmet>
        <title>Chipolte Menu Finder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Link to="/" className="link" style={{ textDecoration: "none" }}>Search</Link>
      <Link to="/about" className="link" style={{ textDecoration: "none" }}>About</Link>
      <a className="link" href="https://github.com/DanielSorrell/Chipotle-menu-and-location-finder" target="_blank" rel="noopener noreferrer">Github</a>
    </div>
  );
}

export default Header;
