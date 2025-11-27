import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Overview from "./Overview.jsx";
import Landing from "./Landing.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Dashboard from "./Dashboard.jsx";
import QrList from "./QrList.jsx";
import GenQRCode from "./GenQRCode.jsx";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/gen-qr" element={<GenQRCode />} />
        </Route>
        <Route element={<Overview />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/qr-codes" element={<QrList />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;
