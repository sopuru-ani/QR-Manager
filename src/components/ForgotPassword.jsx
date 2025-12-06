import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMainContext } from "../useMainContext";

function ForgotPassword() {
  const { expressRoute } = useMainContext();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${expressRoute}forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("If this email exists, a reset link has been sent.");
        setEmail("");
      } else {
        setError(data.msg || "Error sending reset link.");
      }
    } catch {
      setError("Server error — try again later.");
    }

    setLoading(false);
  };

  return (
    <>
      <title>Forgot Password</title>
      <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Forgot Password
          </h2>

          <p className="text-gray-600 text-center mb-5 text-sm">
            Enter your email and we'll send you a password reset link.
          </p>

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

          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg
                         focus:outline-none focus:ring-1 focus:ring-lime focus:border-lime"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-5 rounded-lg text-white font-semibold 
              ${
                loading
                  ? "bg-lime-300"
                  : "bg-lime hover:bg-lime-dark transition"
              }
            `}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm">
            <Link className="text-lime-dark hover:underline" to="/login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
