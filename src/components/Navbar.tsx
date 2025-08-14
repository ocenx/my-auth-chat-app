import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
      <div className="flex gap-4">
        {currentUser && (
          <>
            <Link to="/">Welcome</Link>
            <Link to="/todolist">Todo List</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
      <div>
        {currentUser ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
