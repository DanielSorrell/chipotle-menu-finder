import React, { useState, useEffect } from "react";

const Restaurant = (props) => {

  const [isCollapsed, setCollapse] = useState(false);
  const [noItemsDisplay, setNoItemsDisplay] = useState();

  useEffect(() => {
    if(props.restaurantData.dataRetrievalError){
      setNoItemsDisplay(<p>&#10060;Error retrieving menu inventory</p>);
    } else {
      setNoItemsDisplay(<p>&#9989;Restaurant is fully stocked</p>);
    }
  }, [props.restaurantData, setNoItemsDisplay]);

  return (
    <div key={"restaurantContainer" + props.restaurantData.restaurantNumber.toString()} className="restaurantContainer" onClick={() => setCollapse(!isCollapsed)}>
      <div className="locationHeader"><b>{props.restaurantData.address.addressLine1} | {props.restaurantData.address.locality}, {props.restaurantData.address.administrativeArea}</b></div>
      {props.restaurantData.landmark !== undefined && props.restaurantData.landmark !== "Unknown" && props.restaurantData.landmark !== "N/A" &&
        <p><i>{props.restaurantData.landmark.charAt(0).toUpperCase() + props.restaurantData.landmark.slice(1)}</i></p>
      }
      {Object.keys(props.restaurantData.unavailableItems).length > 0
        ? <div key={"unavailableItems" + props.restaurantData.restaurantNumber.toString()} className="unavailableItemsContainer">
            <span className="unavailableItemsLabel">&#10060;View unavailable items:<i className={isCollapsed ? "arrowUp" : "arrowDown"}></i></span>
            <div key={"restaurant" + props.restaurantData.restaurantNumber.toString() + "itemsContainer"} className={isCollapsed ? "expandedItems" : "collapsedItems"}>
              {Object.keys(props.restaurantData.unavailableItems).map((category) =>
                <div key={category} className="unavailableItemsCategoryContainer">
                  <h5 className="unavailableItemsCategory">{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                  <ul className="unavailableItemsList">
                    {props.restaurantData.unavailableItems[category].map((item) => <li key={item}><i>{item}</i></li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        : <span>{noItemsDisplay}</span>
      }
    </div>
  );
}

export default Restaurant;
