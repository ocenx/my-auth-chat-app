import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Welcome() {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
      {/* Profile Image */}
      {currentUser?.photoURL ? (
        <img
          src={currentUser.photoURL}
          alt="Profile"
          className="w-24 h-24 rounded-full shadow-md border-2 border-blue-500"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
          No Photo
        </div>
      )}

      {/* Welcome Message */}
      <h1 className="mt-4 text-2xl font-bold">
        Welcome{currentUser?.displayName ? `, ${currentUser.displayName}` : ""}!
      </h1>
      <p className="mt-1 text-gray-600">You are now logged in 🎉</p>

      {/* Quick Links */}
      <div className="mt-6 flex gap-4">
        <Link
          to="/todolist"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
        >
          📋 Todo List
        </Link>
        <Link
          to="/chat"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md"
        >
          💬 Chat
        </Link>
        <Link
          to="/profile"
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-md"
        >
          ✏️ Edit Profile
        </Link>
      </div>
    </div>
  );
}
