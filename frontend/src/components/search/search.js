import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = (props) => {

  const [address, setAddress] = useState([]);

  const onSubmit = (e) => {
    e.preventDefault();
    props.setloading(true);
    if(props.mapRender){
      props.setMapRender(false);
    }
    axios.get("http://localhost:5000/search/" + address)
      .then(res => {
        props.setloading(false);
        props.setRestaurantsAndMenus(res.data.responseData);
        if(res.data.responseData.status === "Success"){
          props.setMapRender(true);
        } else {
          props.setMapRender(false);
        }
      })
      .catch(error => {
        props.setloading(false);
        console.log(error);
      });
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Search by state, city, or zip code:</label><br />
        <input type="text" size="50" id="addressInput" value={address} onChange={(e) => setAddress(e.target.value)}/>
        <input type="submit" value="searchAddress" />
      </form>
    </div>
  );
}

export default Search;
