import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Welcome: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        {currentUser?.photoURL && (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-2xl font-bold">
          Welcome, {currentUser?.displayName || "User"}!
        </h1>
      </div>
    </div>
  );
};

export default Welcome;
