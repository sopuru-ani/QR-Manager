import React from "react";
import { Link } from "react-router-dom";
import genqr from "../assets/genqr.png";
import overview from "../assets/overview.png";
import qrcodes from "../assets/qrcodeslist.png";

function Landing() {
  return (
    <>
      <title>QR Manager</title>
      <div className="bg-gray-50 text-gray-800">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-20 bg-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">QR Manager</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Track, manage, and generate QR codes effortlessly. See how your
            codes perform and keep everything organized in one place.
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-lime text-white py-2 px-6 rounded-md hover:bg-lime-dark transition font-semibold"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="border-2 border-lime-500 text-lime py-2 px-6 rounded-md hover:bg-lime hover:text-white transition font-semibold"
            >
              Signup
            </Link>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="py-20 px-4 md:px-20 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Your Dashboard</h2>
            <p className="mb-6 text-gray-700">
              Track your QR code performance in one place. See total scans,
              recent activity, and monitor trends easily.
            </p>
          </div>
          <div className=" bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
            <img src={overview} />
          </div>
        </section>

        {/* QR Codes List Section */}
        <section className="py-20 px-4 md:px-20 flex flex-col md:flex-row-reverse items-center gap-10 bg-white">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Access Your QR Codes</h2>
            <p className="mb-6 text-gray-700">
              Manage all your QR codes in one place. Edit, view, and organize
              them with ease.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
            <img src={qrcodes} />
          </div>
        </section>

        {/* Create QR Section */}
        <section className="py-20 px-4 md:px-20 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Create QR Codes</h2>
            <p className="mb-6 text-gray-700">
              Generate new QR codes in seconds. Customize URLs and titles, then
              track their performance instantly.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
            <img src={genqr} />
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-20 px-4 md:px-20 text-center bg-lime text-white">
          <h2 className="text-3xl font-bold mb-4">Get Started for Free</h2>
          <p className="mb-6">
            Join QR Manager today and take control of all your QR codes in one
            place.
          </p>
          <Link
            to="/signup"
            className="bg-white text-lime py-2 px-6 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Signup Now
          </Link>
        </section>
      </div>
    </>
  );
}

export default Landing;
