const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
app.use(cors());
dotenv.config();

app.get("/getKey", (req, res) => {
  res.json({apiKey: process.env.API_KEY});
  console.log("Google Maps API Key successfully sent to frontend");
});

//Handles retrieving nearby Chipotle restaurants locations and current menu inventory for each restaurant
app.get("/search/:address", (req, res) => {

  //Takes user requested address and returns nearby restaurants locations and current menu inventory for each restaurant
  async function getRestaurantsAndData(address) {
    //Google Maps API call to get geographic coordinates from requested address
    const getAddressCoordinates = await axios("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + process.env.API_KEY)
      .then(addressCoordinates => {
        return addressCoordinates.data.results[0].geometry.location; //{{ lat, lng }}
      }).catch(coordiantesError => {
        console.log(coordinatesError);
        let responseData = {
          status: "Error",
          data: "Invalid address error. Please try again with a valid address."
        }
        res.json({responseData: responseData});
      });
    let coordinates = getAddressCoordinates;

    //Chipotle API call to get nearby restaurants from geographic coordinates
    const getRestaurants = await axios({
      method: "post",
      url: "https://services.chipotle.com/restaurant/v3/restaurant",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Chipotle-CorrelationId": "OrderWeb-fa4809d4-8a62-4ccb-9cbd-4a4f57eed9c3",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "Host": "services.chipotle.com",
        "Ocp-Apim-Subscription-Key": "b4d9f36380184a3788857063bce25d6a",
        "Origin": "https://www.chipotle.com",
        "Referer": "https://www.chipotle.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
        "sec-ch-ua": ".Not/A)Brand;v=99, Google Chrome;v=103, Chromium;v=103",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows"
      },
      data: {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        radius: 80467,
        restaurantStatuses: [
            "OPEN",
            "LAB"
        ],
        conceptIds: [
            "CMG"
        ],
        orderBy: "distance",
        orderByDescending: false,
        pageSize: 10,
        pageIndex: 0,
        embeds: {
            addressTypes: [
                "MAIN"
            ],
            realHours: true,
            directions: true,
            catering: true,
            onlineOrdering: true,
            timezone: true,
            marketing: true,
            chipotlane: true,
            sustainability: true,
            experience: true
      }
    }
    }).then(nearbyRestaurants => {
      return nearbyRestaurants.data.data; //Return nearby restaurants to retrieve menu inventory for each
    }).catch(restaurantLocationsError => {
      const error =
      console.log(restaurantLocationsError);
      let responseData = {
        status: "Error",
        data: "Error retrieving nearby restaurants from address " + address + " using latitude/longitude coordinates " + coordinates.lat + " and " + coordinates.lng
      }
      res.json({responseData: responseData});
    });
  let nearbyRestaurants = getRestaurants;

  if(nearbyRestaurants.length === 0){
    responseData = {
      status: "Error",
      data: "There are no nearby Chipotle restaurants"
    };
    res.json({responseData: responseData});
  } else {
    let responseData = {
      status: "Success",
      data: {
        addressSearchCenter: {
          lat: coordinates.lat,
          lng: coordinates.lng
        },
        restaurants: []
      }
    };

    //Make seperate Chipotle API calls for each nearby restaurant for current menu inventory
    for(let i=0; i<nearbyRestaurants.length; i++){
      let restaurant = {
        restaurantNumber: nearbyRestaurants[i].restaurantNumber,
        address: nearbyRestaurants[i].addresses[0],
        landmark: nearbyRestaurants[i].directions.landmark,
        unavailableItems: {},
        dataRetrievalError: false
      };

      await axios({
        method: "get",
        url: "https://services.chipotle.com/menuinnovation/v1/restaurants/" + nearbyRestaurants[i].restaurantNumber + "/onlinemenu?channelId=web&includeUnavailableItems=true",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "max-age=0",
          "Chipotle-CorrelationId": "OrderWeb-d6463505-83e8-43df-b8e4-586cff9012b5",
          "Connection": "keep-alive",
          "If-None-Match": "undefined",
          "Ocp-Apim-Subscription-Key": "b4d9f36380184a3788857063bce25d6a",
          "Origin": "https://www.chipotle.com",
          "Referer": "https://www.chipotle.com/",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
          "sec-ch-ua": ".Not/A)Brand;v=99, Google Chrome;v=103, Chromium;v=103",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "Windows"
        }
        }).then(restaurantData => {
        Object.keys(restaurantData.data).forEach(category => {
          if(category == "nonFoodItems" || category == "restaurantId"){ //skip non menu inventory
            return;
          } else {
            //Loop through each menu item and check availability
            for(let j=0; j<restaurantData.data[category].length; j++){
              if(restaurantData.data[category][j].isItemAvailable == false){
                //If respective menu category (entrees, sides, or drinks) has not been started, create it
                if(!(restaurant.unavailableItems.hasOwnProperty(category))){
                  restaurant.unavailableItems[category] = [];
                }
                restaurant.unavailableItems[category].push(restaurantData.data[category][j].itemName);
              }
            }
          }
        });
        responseData.data.restaurants.push(restaurant);
        }).catch(restaurantDataError => {
          console.log("Error retrieving restaurant data from restaurant " + nearbyRestaurants[i].restaurantNumber + ":");
          console.log(restaurantDataError);
          restaurant.dataRetrievalError = true; //Mark error for current restaurant
          responseData.data.restaurants.push(restaurant);
        });
      }
      //Returns an object of nearby restaurants and current menu inventory for each if no errors occur
      res.json({responseData: responseData});
    }
  }

  getRestaurantsAndData(req.params.address);
});

app.listen(5000);
