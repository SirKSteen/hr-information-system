import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-gray-600 to-gray-100 p-4">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-sm lg:max-w-md transition-transform transform hover:scale-105">
        <h2 className="text-2xl md:text-1xl font-bold text-center text-gray-800 mb-5">
          You've successfully logged out
        </h2>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transition-all duration-300"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}
