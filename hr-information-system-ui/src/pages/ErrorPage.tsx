import React from "react";

export default function ErrorPage() {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-gray-600 to-gray-100 p-4">
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-sm lg:max-w-md transition-transform transform hover:scale-105">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
            Page Not Found
          </h2>
        </div>
      </div>
    </div>
  );
}
