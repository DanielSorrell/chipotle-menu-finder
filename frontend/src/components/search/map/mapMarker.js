import React, { useState, useEffect } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

const MapMarker = (props) => {
  const [toggleInfoWindow, setToggleInfoWindow] = useState(false);
  const [itemsDislay, setItemsDislay] = useState();

  
  useEffect(() => {
    if(props.restaurant.dataRetrievalError){
      setItemsDislay(<p>Error retrieving restaurant menu</p>);
    } else if(Object.keys(props.restaurant.unavailableItems).length === 0){
      setItemsDislay(<p>&#9989;Restaurant is fully stocked</p>);
    } else {
      setItemsDislay(
        <div key="unavailableItems" className="unavailableItemsContainer">
          <p className="unavailableItemsLabel">&#10060;There are unavailable items:</p>
          <div key={"restaurant" + props.restaurant.restaurantNumber.toString() + "itemsContainer"}>
            {Object.keys(props.restaurant.unavailableItems).map((category) =>
              <div key={category} className="unavailableItemsCategoryContainer">
                <h5 className="unavailableItemsCategory">{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                <ul>
                  {props.restaurant.unavailableItems[category].map((item) => <li key={item}><i>{item}</i></li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }
  }, [props.restaurant, setItemsDislay]);

  const windowContent = (
    <div>
      <h4>{props.restaurant.address.addressLine1} | {props.restaurant.address.locality}, {props.restaurant.address.administrativeArea}</h4>
      {props.restaurant.landmark !== undefined && props.restaurant.landmark !== "Unknown" && props.restaurant.landmark !== "N/A" &&
        <p><i>{props.restaurant.landmark}</i></p>
      }
      {itemsDislay}
    </div>
  );

  return (
    <Marker
      key={props.restaurant.restaurantNumber}
      position={{ lat: props.restaurant.address.latitude, lng: props.restaurant.address.longitude }}
      icon="https://www.chipotle.com/content/dam/poc/order/images/icons/pepper-marker2x.png"
      onClick={() => setToggleInfoWindow(!toggleInfoWindow)}
    >
      {toggleInfoWindow ? (
        <InfoWindow onCloseClick={() => setToggleInfoWindow(false)}>
          {windowContent}
        </InfoWindow>
      ) : null
      }

    </Marker>
  );
}

export default MapMarker;
