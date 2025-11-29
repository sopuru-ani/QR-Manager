import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";

import { useMainContext } from "../useMainContext";

function DeleteAccount({ open, onClose }) {
  if (!open) return null;
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { expressRoute } = useMainContext();

  const [email, setEmail] = useState("");
  const [confirmText, setConfirmText] = useState("");
  async function deleteAccount() {
    try {
      const response = await fetch(`${expressRoute}account`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (response.status === 401) {
        console.log(data.msg);
        navigate("/login");
      }
      if (response.ok) {
        // navigate("/");
        setSuccess(true);
        setSuccessMsg("Login successful! Redirecting to dashboard...");
        setError(false);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
      if (!response.ok) {
        setError(true);
        setErrorMsg(data.msg || "Login failed. Please try again.");
      }
    } catch (error) {
      setError(true);
      setErrorMsg("Server error. Please try again later.");
    }
  }

  return (
    <div
      className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
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

        <h3 className="text-xl font-bold mb-3 text-gray-800">
          <span className="text-red-500">Delete Account</span> - are you sure?
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          Deleting your account is <strong>permanent</strong>. All related data
          will be erased and cannot be restored.
        </p>
        {/* {error or success box below} */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded mb-2 animate-fade-in">
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-600 text-green-700 p-3 rounded mb-2 animate-fade-in">
            <p className="font-medium">{successMsg}</p>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">
            Type <strong>'DELETE'</strong> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400"
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
            disabled={!email || confirmText !== "DELETE"}
            className={`px-4 py-2 rounded-lg text-white transition ${
              !email || confirmText !== "DELETE"
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={deleteAccount}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;
