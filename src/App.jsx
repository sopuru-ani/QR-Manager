import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useMainContext } from "./useMainContext.jsx";
import AppRoutes from "./components/AppRoutes.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const { expressRoute } = useMainContext();
  async function fetchData() {
    const response = await fetch(expressRoute);
    const data = await response.json();
  }
  fetchData();
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
