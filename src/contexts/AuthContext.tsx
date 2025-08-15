// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, updateProfile, signOut, User } from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (displayName: string, file?: File | null) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  setCurrentUser: () => {},
  updateUserProfile: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const updateUserProfile = async (displayName: string, file?: File | null) => {
    try {
      let photoURL = currentUser?.photoURL || "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          photoURL = data.secure_url;
        } else {
          throw new Error(data.error?.message || "Cloudinary upload failed");
        }
      }

      if (currentUser) {
        await updateProfile(currentUser, { displayName, photoURL });
        setCurrentUser({ ...currentUser, displayName, photoURL });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, setCurrentUser, updateUserProfile, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
