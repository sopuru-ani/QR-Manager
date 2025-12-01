import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import OTPInput from "./OTPInput";
import { useMainContext } from "../useMainContext";

function SignupFlow() {
  const navigate = useNavigate();
  const { expressRoute } = useMainContext();

  const [step, setStep] = useState(1); // 1: Email, 2: Verify, 3: Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resend, setResend] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Timer for resend code
  const [resendTimer, setResendTimer] = useState(60);
  const [expireTimer, setExpireTimer] = useState(600);
  useEffect(() => {
    if (step !== 2) return;

    const interval = setInterval(() => {
      setExpireTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setResend(false);

    return () => clearInterval(interval);
  }, [step, resend]);

  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  async function handleSendEmail() {
    // call /auth/send-code here
    try {
      const response = await fetch(`${expressRoute}auth/send-code`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email }),
      });
      const data = await response.json();
      if (response.ok) {
        setError("");
        setStep(2);
        setResendTimer(60);
        setExpireTimer(600);
        setResend(true);
      }
      if (!response.ok) {
        setError(data.msg);
      }
    } catch (error) {
      setError("Server Error. Please try again later");
    }
  }

  async function handleVerifyCode() {
    // call /auth/verify-code here
    if (code.length === 6) {
      try {
        const response = await fetch(`${expressRoute}auth/verify-code`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: email, code: code }),
        });
        const data = await response.json();
        if (response.ok) {
          setExpireTimer(600);
          setError("");
          setStep(3);
        }
        if (!response.ok) {
          setError("code has expired");
        }
      } catch (error) {
        setError(data.msg);
      }
    } else {
      setError("Enter a 6-digit code");
    }
  }

  async function handleFinalSignup(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${expressRoute}signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Signup successful
        // setSignup(true);
        // setSignupMsg("Signup successful! Redirecting to dashboard...");
        setSuccess("Signup successful! Redirecting to dashboard...");
        setError("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        // Handle login failure (e.g., show error message)
        console.log("Login failed");
        setError(data.msg);
        // setErrorMsg(data.msg || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
      // setErrorMsg("Server error. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-lime mb-4 text-center">
              Create Account
            </h2>
            <p className="text-gray-dark mb-6 text-center">
              Enter your email to continue
            </p>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded mb-2 animate-fade-in">
                <p className="font-normal">{error}</p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-dark mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-lime"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              onClick={handleSendEmail}
              disabled={!email}
              className={`w-full bg-lime text-white py-2 rounded-md hover:bg-lime-dark transition ${
                !email ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold text-lime mb-4 text-center">
              Verify Email
            </h2>
            <p className="text-gray-dark mb-4 text-center">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            {expireTimer === 0 ? (
              <p className="text-xs text-red-500 text-center mb-4">
                Code expired
              </p>
            ) : (
              <p className="text-xs text-gray-dark text-center mb-4">
                Code expires in {formatTime(expireTimer)}
              </p>
            )}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded mb-2 animate-fade-in">
                <p className="font-normal">{error}</p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-dark mb-1">
                Verification Code
              </label>
              {/* <OTPInput length={6} value={code} setValue={setCode} /> */}
              <OTPInput length={6} value={code} onChange={setCode} />
            </div>
            <button
              onClick={handleVerifyCode}
              className="w-full bg-lime text-white py-2 rounded-md hover:bg-lime-dark transition"
            >
              Verify
            </button>
            <div className="mt-2 text-sm text-gray-dark text-center">
              {resendTimer > 0 ? (
                <>Resend code in {resendTimer}s</>
              ) : (
                <button
                  onClick={() => {
                    handleSendEmail();
                  }}
                  className="text-lime hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setExpireTimer(600);
                  setError("");
                  setStep(1);
                }}
                className="text-gray-500 hover:underline text-sm"
              >
                Wrong email? Go back
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-3xl font-bold text-lime mb-4 text-center">
              Finish Signup
            </h2>
            {success && (
              <div className="bg-green-100 border-l-4 border-green-600 text-green-700 p-3 rounded mb-2 animate-fade-in">
                <p className="font-normal">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded mb-2 animate-fade-in">
                <p className="font-normal">{error}</p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-dark mb-1">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full border border-gray rounded-md p-2 bg-gray-100"
              />
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1 group">
                <label
                  htmlFor="firstName"
                  className="block text-gray-dark mb-1 group-focus-within:text-lime"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-lime"
                />
              </div>
              <div className="flex-1 group">
                <label
                  htmlFor="lastName"
                  className="block text-gray-dark mb-1 group-focus-within:text-lime"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-lime"
                />
              </div>
            </div>
            <div className="mb-4 group">
              <label
                htmlFor="password"
                className="block text-gray-dark mb-1 group-focus-within:text-lime"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-lime"
              />
            </div>
            <div className="mb-4 group">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-dark mb-1 group-focus-within:text-lime"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-lime"
              />
            </div>
            <button
              onClick={handleFinalSignup}
              className="w-full bg-lime text-white py-2 rounded-md hover:bg-lime-dark transition"
            >
              Create Account
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center my-4">
              <hr className="flex-1 border-gray" />
              <span className="mx-2 text-gray-dark pl-4 pr-4">or</span>
              <hr className="flex-1 border-gray" />
            </div>
            <button className="w-full flex items-center justify-center border border-gray rounded-md py-2 hover:bg-gray-100 transition cursor-pointer">
              <FcGoogle className="mr-2" size={20} />
              Continue with Google
            </button>
            <p className="mt-4 text-center text-gray-dark text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-lime hover:underline cursor-pointer"
              >
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default SignupFlow;
