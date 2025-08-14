// src/pages/Profile.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Profile: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ Pass BOTH arguments to avoid TypeScript error
      await updateUserProfile(displayName, photoURL);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Photo URL</label>
          <input
            type="text"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
