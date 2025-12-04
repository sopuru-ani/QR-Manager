import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

import { useMainContext } from "../useMainContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

function Login() {
  const { expressRoute } = useMainContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => googleSignUp(tokenResponse),
    onError: () => console.log("Login Failed"),
  });
  async function googleSignUp(tokenResponse) {
    setLoading(true);
    try {
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      const userInfoData = await userInfo.json();
      const response = await fetch(`${expressRoute}googlesignup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          googleId: userInfoData.sub,
          email: userInfoData.email,
          name: userInfoData.name,
          picture: userInfoData.picture,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setLogin(true);
        setError(false);
        setLoginMsg("Google login successful! Redirecting to dashboard...");
        setLoading(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
      if (!response.ok) {
        setError(true);
        setLoading(false);
        setErrorMsg(data.msg || "Something went wrong. try again later");
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      setErrorMsg("Server error. Please try again later.");
    }
  }

  async function loginAuthentication(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${expressRoute}login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      // console.log(data);
      if (response.ok) {
        setLogin(true);
        setLoginMsg("Login successful! Redirecting to dashboard...");
        setError(false);
        setLoading(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        // Handle login failure (e.g., show error message)
        console.log("Login failed");
        setError(true);
        setLoading(false);
        setErrorMsg(data.msg || "Login failed. Please try again.");
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      setErrorMsg("Server error. Please try again later.");
    }
  }
  return (
    <>
      <title>Login</title>
      <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-lime mb-4 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-dark mb-6 text-center">
            Login to access your QR codes
          </p>

          <form className="space-y-4" onSubmit={loginAuthentication}>
            {/* {error or success box below} */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded mb-2 animate-fade-in">
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}
            {login && (
              <div className="bg-green-100 border-l-4 border-green-600 text-green-700 p-3 rounded mb-2 animate-fade-in">
                <p className="font-medium">{loginMsg}</p>
              </div>
            )}

            <div className="mb-4 group">
              <label
                htmlFor="email"
                className="block text-gray-dark mb-1 
               group-focus-within:text-lime"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full border border-gray rounded-md p-2 
               focus:outline-none focus:ring-1 focus:ring-lime"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4 group">
              <label
                htmlFor="password"
                className="block text-gray-dark mb-1 group-focus-within:text-lime"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="w-full border border-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-lime"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-lime text-white py-2 rounded-md hover:bg-lime-dark transition cursor-pointer"
              disabled={loading}
            >
              {!loading ? "Login" : <LoadingSpinner value={"Login"} />}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray" />
            <span className="mx-2 text-gray-dark pl-4 pr-4">or</span>
            <hr className="flex-1 border-gray" />
          </div>

          <button
            className="w-full flex items-center justify-center border border-gray rounded-md py-2 hover:bg-gray-100 transition cursor-pointer"
            disabled={loading}
            onClick={() => {
              googleLogin();
            }}
          >
            <FcGoogle className="mr-2" size={20} />
            Continue with Google
          </button>

          <p className="mt-4 text-center text-gray-dark text-sm">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-lime hover:underline cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
