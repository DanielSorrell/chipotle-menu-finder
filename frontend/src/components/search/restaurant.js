import React, { useState, useEffect } from "react";

const Restaurant = (props) => {

  const [isCollapsed, setCollapse] = useState(false);
  const [noItemsDisplay, setNoItemsDisplay] = useState();

  useEffect(() => {
    if(props.restaurantData.dataRetrievalError){
      setNoItemsDisplay("Error retrieving menu inventory");
    } else {
      setNoItemsDisplay("Restaurant is fully stocked");
    }
  }, [props.restaurantData, setNoItemsDisplay]);

  return (
    <div key={"restaurantContainer" + props.restaurantData.restaurantNumber.toString()} className="restaurantContainer" onClick={() => setCollapse(!isCollapsed)}>
      <h4>{props.restaurantData.address.addressLine1} | {props.restaurantData.address.locality}, {props.restaurantData.address.administrativeArea}</h4>
      {props.restaurantData.landmark !== undefined &&
        <h5>{props.restaurantData.landmark}</h5>
      }
      {Object.keys(props.restaurantData.unavailableItems).length > 0
        ? <div key={"unavailableItems" + props.restaurantData.restaurantNumber.toString()} className="unavailableItemsContainer">
            <p>View unavailable items:<i className={isCollapsed ? "arrowUp" : "arrowDown"}></i></p>
            <div key={"restaurant" + props.restaurantData.restaurantNumber.toString() + "itemsContainer"} className={isCollapsed ? "expandedItems" : "collapsedItems"}>
              {Object.keys(props.restaurantData.unavailableItems).map((category) =>
                <div key={category} className="unavailableItemsCategoryContainer">
                  <h5 className="unavailableItemsCategory">{category}</h5>
                  <ul>
                    {props.restaurantData.unavailableItems[category].map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        : <p>{noItemsDisplay}</p>
      }
    </div>
  );
}

export default Restaurant;
