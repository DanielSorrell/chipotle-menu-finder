import React, { useState, useEffect } from "react";
import Search from "./search.js";
import Map from "./map/map.js";
import Restaurant from "./restaurant.js";
import Header from "../partials/header.js";
import Footer from "../partials/footer.js";
import axios from "axios"

function App() {

  const [restaurantsAndMenus, setRestaurantsAndMenus] = useState();
  const [restaurants, setRestaurants] = useState();
  const [mapRender, setMapRender] = useState(false);
  const [isloading, setloading] = useState(false);
  const [apiKey, setKey] = useState();

  useEffect(() => {
    axios.get("http://localhost:5000/getKey")
      .then(res => {
        setKey(res.data.apiKey);
      })
      .catch(error => console.log("Error retrieving Google Maps API Key"));
  }, []);

  useEffect(() => {
    if(restaurantsAndMenus === undefined){
      return;
    } else if(restaurantsAndMenus.status === "Error"){
      setRestaurants(<p>{restaurantsAndMenus.data}</p>);
    } else {
      let restaurantsArray = [];
      restaurantsAndMenus.data.restaurants.map((item) => {
        restaurantsArray.push(<Restaurant restaurantData={item} />);
      });
      setRestaurants(restaurantsArray);
    }
  }, [restaurantsAndMenus, setRestaurants]);

  return (
    <div>

      <Header />

      <div id="main" className={!mapRender ? "fill" : null}>

        <div id="searchContainer" className="mainContainer">
          <Search setRestaurantsAndMenus={setRestaurantsAndMenus} setloading={setloading} setMapRender={setMapRender} mapRender={mapRender} />
          {restaurants}
        </div>

        {isloading
          ? <div id="loadingData" className="mainContainer">
              <p>Loading data, please wait..</p>
              <p>(This may take a few seconds)</p>
            </div>
          : <div id="mapContainer" className="mainContainer">
              {apiKey !== undefined
                ? <Map restaurantsAndMenus={restaurantsAndMenus} mapRender={mapRender} apiKey={apiKey}/>
                : <h1>Error retrieving Google Maps API Key</h1>
              }
            </div>
        }

      </div>

      <Footer />

    </div>
  );
}

export default App;