import React, { useState, useEffect, useRef } from "react";
import {
  Outlet,
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FiHome, FiSettings, FiPlus, FiMenu, FiX } from "react-icons/fi";
import { LuQrCode as QrCode } from "react-icons/lu";

import { useMainContext } from "../useMainContext";
import ProfileModal from "./ProfileModal.jsx";
import DeleteAccount from "./DeleteAccount.jsx";

function Overview() {
  const { expressRoute, isLight, setIsLight } = useMainContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const triggerRef = useRef(null);

  async function logout(e) {
    e.preventDefault();
    const response = await fetch(`${expressRoute}logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      navigate("/login");
    }
  }
  useEffect(() => {
    async function profile() {
      const response = await fetch(`${expressRoute}profile`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.status === 401) {
        console.log(data.msg);
        navigate("/login");
      }
      if (response.ok) {
        console.log(data);
        setProfileData(data);
      }
    }
    profile();
    console.log(profileData);
  }, []);
  return (
    <div className="min-h-screen flex bg-amber-50">
      {/* Sidebar */}
      <aside
        className={`w-full bg-white shadow-md fixed inset-y-0 left-0 transform z-10
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  transition-transform duration-300 md:relative md:translate-x-0 md:flex flex-col md:w-50`}
      >
        <button
          className="absolute top-6 right-6 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <FiX size={24} />
        </button>
        {/* <div className="absolute bottom-6 left-6 md:hidden w-10 h-10 bg-lime text-white rounded-full flex items-center justify-center font-bold">
          {profileData?.[0].firstName?.[0] || "N"}
          {profileData?.[0].lastName?.[0] || "A"}
        </div> */}
        <div className="p-6">
          <Link to="/">
            <h1 className="text-2xl font-bold text-lime mb-8 cursor-pointer">
              QR Manager
            </h1>
          </Link>
          <nav className="flex flex-col space-y-4">
            <NavLink
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center transition ${
                  isActive
                    ? "text-lime font-semibold"
                    : "text-gray-dark hover:text-lime"
                }`
              }
            >
              <FiHome className="mr-2" /> Dashboard
            </NavLink>
            <NavLink
              to="/qr-codes"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center transition ${
                  isActive
                    ? "text-lime font-semibold"
                    : "text-gray-dark hover:text-lime"
                }`
              }
            >
              <FiPlus className="mr-2" /> My QR Codes
            </NavLink>
            <NavLink
              to="/gen-qr"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center transition ${
                  isActive
                    ? "text-lime font-semibold"
                    : "text-gray-dark hover:text-lime"
                }`
              }
            >
              <QrCode className="mr-2" /> New Qr code
            </NavLink>
            {/* {tbc} */}
            {/* <a
              href="#"
              className="flex items-center text-gray-dark hover:text-lime transition"
            >
              <FiSettings className="mr-2" /> Settings
            </a> */}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center md:ml-0">
          <div className="flex items-center space-x-4">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-dark">
              {location.pathname === "/dashboard" && "Dashboard"}
              {location.pathname === "/qr-codes" && "QR Code"}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-lime text-white py-1 px-3 rounded-md hover:bg-lime-dark transition border-2 border-lime-500">
              <Link to="/gen-qr">New QR</Link>
            </button>
            <div
              ref={triggerRef}
              className="w-10 h-10 mr-0 bg-lime text-white rounded-full flex items-center justify-center font-bold cursor-pointer"
              // onClick={() => {
              //   setShowProfile(true);
              // }}
              onClick={() => setShowProfile(!showProfile)}
            >
              {profileData?.[0].firstName?.[0] || "N"}
              {profileData?.[0].lastName?.[0] || "A"}
            </div>
            <ProfileModal
              show={showProfile}
              onClose={() => setShowProfile(false)}
              triggerRef={triggerRef}
              profileData={profileData}
              logout={logout}
              showDeleteAccount={showDeleteAccount}
              setShowDeleteAccount={setShowDeleteAccount}
            />
            <DeleteAccount
              open={showDeleteAccount}
              onClose={() => setShowDeleteAccount(false)}
            />
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}

export default Overview;
