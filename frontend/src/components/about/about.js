import React from "react";
import Footer from "../partials/footer.js";
import Header from "../partials/header.js";
import chipotleStep1 from "./originalSearchImages/Step 1.PNG";
import chipotleStep2 from "./originalSearchImages/Step 2.PNG";
import chipotleStep3 from "./originalSearchImages/Step 3.PNG";
import chipotleStep4 from "./originalSearchImages/Step 4.PNG";
import chipotleStep5 from "./originalSearchImages/Step 5.PNG";
import appStep1 from "./appSearchImages/Step 1.PNG";
import appStep2 from "./appSearchImages/Step 2.PNG";
import appStep3 from "./appSearchImages/Step 3.PNG";

const About = () => {

  return (

    <div id="aboutMain">

      <Header />

      <div id="chipotleProcess">
        <div className="directions">
          <p>When using the official chipotle website, you must:</p>
          <ol>
            <li>Search for a restaurant location</li>
            <li>Select restaurant location</li>
            <li>Select pickup option</li>
            <li>Select an entree</li>
          </ol>
          <p>
          in order to view menu item availability only for the selected restaurant location:
          </p>
        </div>
        <div className="processImages">
          <img src={chipotleStep1} alt="chipotleStep1" width="80%" height="80%" />
          <img src={chipotleStep2} alt="chipotleStep2" width="80%" height="80%" />
          <img src={chipotleStep3} alt="chipotleStep3" width="80%" height="80%" />
          <img src={chipotleStep4} alt="chipotleStep4" width="80%" height="80%" />
          <img src={chipotleStep5} alt="chipotleStep5" width="80%" height="80%" />
        </div>
      </div>
      <br/><p>
      With this application, all you need to do is search an address, and you are able
      view nearby restaurants and menu item availability for each restaurant for added convenience:
      </p>
      <div className="processImages">
        <img src={appStep1} alt="appStep1" width="80%" height="80%" />
        <img src={appStep2} alt="appstep2" width="80%" height="80%" />
        <img src={appStep3} alt="appStep3" width="80%" height="80%" />
      </div>

      <br/>
      <a id="homeLink" href="/">Back to search</a><br/><br/>

      <Footer />

    </div>

  );
}

export default About;
