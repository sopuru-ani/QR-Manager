import React from "react";
import { Link } from "react-router-dom";

function EmptyQRState() {
  return (
    <div className="h-[calc(100dvh-88px)] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <span className="text-4xl">📭</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No QR Codes Yet
        </h2>

        <p className="text-gray-500 max-w-sm mb-6">
          Create your first QR code and start tracking visits, scans, and
          analytics instantly.
        </p>

        <Link
          to="/gen-qr"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Create QR Code
        </Link>
      </div>
    </div>
  );
}

export default EmptyQRState;
