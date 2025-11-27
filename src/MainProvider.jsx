import React, { useState } from "react";
import { MainContext } from "./MainContext";

function MainProvider({ children }) {
  const expressRoute = "http://localhost:3000/";
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
