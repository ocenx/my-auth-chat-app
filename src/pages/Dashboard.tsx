import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {currentUser?.displayName || currentUser?.email}</h1>
      <p className="mt-2">
        Manage your account in your <Link to="/profile" className="text-blue-500">Profile</Link>.
      </p>
    </div>
  );
};

export default Dashboard;
