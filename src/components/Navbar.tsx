import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!currentUser) return null; // No navbar if not logged in

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">
          Profile
        </Link>
        <Link to="/chat" className="hover:underline">
          Chat
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {currentUser.photoURL && (
          <img
            src={currentUser.photoURL}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border"
          />
        )}
        <span>{currentUser.displayName || "User"}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
