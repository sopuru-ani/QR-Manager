import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { useMainContext } from "../useMainContext";

function AddPassword({ show, setRender, onClose }) {
  const { expressRoute } = useMainContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!password || !confirmPassword) {
      return setErrorMsg("Please fill in both fields.");
    }
    if (password !== confirmPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    setLoading(true);
    try {
      const response = await fetch(`${expressRoute}addpassword`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(data.msg || "Password added successfully!");
        setPassword("");
        setConfirmPassword("");
        setRender(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg(data.msg || "Something went wrong.");
      }
    } catch (err) {
      setErrorMsg("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <FiX size={24} />
        </button>

        <h3 className="text-xl font-bold mb-3 text-gray-800">Add a Password</h3>
        <p className="text-gray-600 text-sm mb-4">
          Set a password to enable login via email and password in addition to
          Google.
        </p>

        {errorMsg && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded mb-2 animate-fade-in">
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 border-l-4 border-green-600 text-green-700 p-3 rounded mb-2 animate-fade-in">
            <p className="font-medium">{successMsg}</p>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-gray-700 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-lime focus:border-lime"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-lime focus:border-lime"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-lime-300 cursor-not-allowed"
                : "bg-lime hover:bg-lime-dark"
            }`}
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPassword;
