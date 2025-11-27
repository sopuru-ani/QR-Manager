import React, { useContext } from "react";
import { MainContext } from "./MainContext";

export function useMainContext() {
  return useContext(MainContext);
}
