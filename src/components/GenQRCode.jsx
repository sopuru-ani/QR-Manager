import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useMainContext } from "../useMainContext";
import LoadingSpinner from "./LoadingSpinner";

function GenQRCode() {
  const navigate = useNavigate();
  const { expressRoute, isValidUrl } = useMainContext();
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [qrSuccess, setQrSuccess] = useState(false);
  const [qrSuccessMsg, setQrSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  async function generateQRCode(e) {
    e.preventDefault();
    setLoading(true);
    if (title.trim() === "" || url.trim() === "") {
      setError(true);
      setQrSuccess(false);
      setErrorMsg("Both Title and URL are required.");
      setLoading(false);
      return;
    }
    if (!isValidUrl(url)) {
      setError(true);
      setQrSuccess(false);
      setErrorMsg("Please enter a valid URL.");
      setLoading(false);
      return;
    }

    const response = await fetch(`${expressRoute}api/genqrcode`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ url: url, title: title }),
    });
    const data = await response.json();
    if (response.ok) {
      setQrSuccess(true);
      setError(false);
      setImg(data.qrImageUrl);
      setLoading(false);
      setQrSuccessMsg("QR Code generated successfully!");
    }
    if (response.status === 401) {
      setError(true);
      setQrSuccess(false);
      setErrorMsg("Unauthorized. Redirecting to login...");
      setLoading(false);
      navigate("/login");
    }
    if (!response.ok) {
      setError(true);
      setQrSuccess(false);
      setLoading(false);
      setErrorMsg(data.msg || "Failed to generate QR Code. Please try again.");
    }
  }
  return (
    <>
      <title>Generate QR code</title>
      <div className="mt-2 mb p-6 h-[calc(100dvh-88px)] flex items-center justify-center overflow-y-auto scrollbar-thin scrollbar-thumb-lime scrollbar-track-gray-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full hover:scrollbar-thumb-lime-dark">
        <div className="w-full max-w-xl flex flex-col items-center">
          {/* Page Header */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create a QR Code
          </h1>

          {/* Form Container */}
          <div className="w-full bg-white shadow-md rounded-xl p-6">
            <form className="space-y-5" onSubmit={generateQRCode}>
              {/* {error or success box below} */}
              {error && (
                <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded mb-2 animate-fade-in">
                  <p className="font-medium">{errorMsg}</p>
                </div>
              )}
              {qrSuccess && (
                <div className="bg-green-100 border-l-4 border-green-600 text-green-700 p-3 rounded mb-2 animate-fade-in">
                  <p className="font-medium">{qrSuccessMsg}</p>
                </div>
              )}
              {/* Title Input */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Title
                </label>

                <input
                  type="text"
                  id="title"
                  placeholder="My QR Code"
                  className="w-full border border-gray-300 rounded-md p-2
                       focus:outline-none focus:ring-1 focus:ring-lime-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* URL Input */}
              <div>
                <label
                  htmlFor="url"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Destination URL
                </label>

                <input
                  type="text"
                  id="url"
                  placeholder="https://example.com"
                  className="w-full border border-gray-300 rounded-md p-2
                       focus:outline-none focus:ring-1 focus:ring-lime-600"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              {img === "" && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-lime-600 text-white font-medium py-2 rounded-md hover:bg-lime-700 transition"
                >
                  {!loading ? (
                    "Generate QR Code"
                  ) : (
                    <LoadingSpinner value={"Generate QR Code"} />
                  )}
                </button>
              )}
              {img !== "" && (
                <Link to="/dashboard">
                  <div className="w-full bg-lime-600 text-white font-medium py-2 rounded-md hover:bg-lime-700 transition text-center cursor-pointer">
                    Back to Dashboard
                  </div>
                </Link>
              )}
            </form>
          </div>

          {/* Result Section */}
          <div className="w-full mt-8 bg-white shadow-md rounded-xl p-6 flex flex-col items-center gap-4">
            {img === "" && (
              <div className="h-40 w-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                QR PREVIEW
              </div>
            )}
            {img === "" && (
              <p className="text-gray-700 text-sm">
                Your QR code will appear here after generation.
              </p>
            )}
            {img !== "" && (
              <img src={img} alt="Generated QR Code" className="h-40 w-40" />
            )}
            {img !== "" && (
              <a
                href={img}
                download={`${title}.png`}
                className="mt-1 bg-lime-600 text-white font-medium py-2 px-4 rounded-md hover:bg-lime-700 transition"
              >
                Download QR Code
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GenQRCode;
