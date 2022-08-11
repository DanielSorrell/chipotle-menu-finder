import React, { useState, useEffect } from "react"
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MapMarker from "./mapMarker.js";

function Map(props) {

  const [markers, setMarkers] = useState();
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if(props.mapRender){
      let newMarkers = [];
      setZoom(11);
      setCenter(props.restaurantsAndMenus.data.addressSearchCenter);
      props.restaurantsAndMenus.data.restaurants.map((restaurant) => {
        newMarkers.push(
          <MapMarker restaurant={restaurant} />
        );
      });
      setMarkers(newMarkers);
    }
  }, [props.restaurantsAndMenus, props.mapRender]);

  const containerStyle = {
    width: "100%",
    height: "100%"
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: props.apiKey
  })

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom}
        center={center}
      >
        {markers}
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(Map)
