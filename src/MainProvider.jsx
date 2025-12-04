import React, { useState } from "react";
// import dotenv from "dotenv";

import { MainContext } from "./MainContext";
// dotenv.config();

function MainProvider({ children }) {
  // const expressRoute = "https://qr-manager-server-gec1.onrender.com/";
  const expressRoute = "https://server.qr-manager.net";
  // const expressRoute = "http://localhost:3000/";
  // const CLIENT_ID = process.env.CLIENT_ID;
  const [isLight, setIsLight] = useState(true);
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }
  return (
    <MainContext.Provider
      value={{ expressRoute, isValidUrl, isLight, setIsLight }}
    >
      {children}
    </MainContext.Provider>
  );
}

export default MainProvider;
