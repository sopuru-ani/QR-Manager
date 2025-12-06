import React, { useState, useEffect } from "react";
import { useMainContext } from "../useMainContext";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const { expressRoute } = useMainContext();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [verifyToken, setVerifyToken] = useState(false);
  async function verifyTheToken(tkn) {
    const response = await fetch(`${expressRoute}verify-token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token: tkn }),
    });
    const data = await response.json();
    if (response.status === 401) {
      navigate("/signup");
    }
    if (response.ok) {
      setVerifyToken(true);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get("token");
    if (t) {
      setToken(t);
      verifyTheToken(token);
    } else {
      setError("Invalid or missing reset token.");
      navigate("/login");
    }
  }, [verifyToken]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const res = await fetch(`${expressRoute}reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      });

      const data = await res.json();
      if (res.status === 401) {
        setError(data.msg);
        setTimeout(() => navigate("/login"), 1500);
      }

      if (res.ok) {
        setMessage(
          data.msg || "Password reset successful! Redirecting to login..."
        );
        setTimeout(() => navigate("/login"), 1500);
      } else setError(data.msg || "Something went wrong.");
    } catch {
      setError("Server error — try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <title>Reset Password</title>
      {verifyToken ? (
        <div></div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Reset Password
            </h2>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded mb-2 animate-fade-in">
                <p className="font-medium">{error}</p>
              </div>
            )}
            {message && (
              <div className="bg-green-100 border-l-4 border-green-600 text-green-700 p-3 rounded mb-2 animate-fade-in">
                <p className="font-medium">{message}</p>
              </div>
            )}

            <form onSubmit={handleReset}>
              <label className="block text-gray-700 text-sm mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 mb-6 focus:border-lime border-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-lime"
                placeholder="••••••••"
                required
              />

              <label className="block text-gray-700 text-sm mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border px-3 py-2 mb-6 focus:border-lime border-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-lime"
                placeholder="••••••••"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white font-semibold 
               ${loading ? "bg-lime-300" : "bg-lime hover:bg-lime-dark"}
            `}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
