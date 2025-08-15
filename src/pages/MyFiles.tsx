import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface FileData {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: any;
  publicId?: string; // For Cloudinary deletion
}

const MyFiles: React.FC = () => {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  // 🔹 Fetch user's files
  useEffect(() => {
    if (!currentUser) return;

    try {
      const filesQuery = query(
        collection(db, "files"),
        where("owner", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        filesQuery,
        (snapshot) => {
          const filesData: FileData[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as any),
          }));
          setFiles(filesData);
          setLoadingFiles(false);
        },
        (err) => {
          console.error("Error fetching files:", err);
          setError(
            err.code === "permission-denied"
              ? "You don't have permission to view these files."
              : "Failed to load files."
          );
          setLoadingFiles(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Firestore query error:", err);
      setError("Failed to load files.");
      setLoadingFiles(false);
    }
  }, [currentUser]);

  // 🔹 Upload file to Cloudinary + Firestore
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          await addDoc(collection(db, "files"), {
            owner: currentUser.uid,
            fileName: file.name,
            fileUrl: response.secure_url,
            publicId: response.public_id, // Save for Cloudinary deletion
            createdAt: serverTimestamp(),
          });

          setUploading(false);
          setProgress(0);
        } else {
          throw new Error("Upload failed");
        }
      };

      xhr.onerror = () => {
        throw new Error("Upload failed");
      };

      xhr.send(formData);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  // 🔹 Delete file from Firestore (+ optional Cloudinary delete)
  const handleDelete = async (file: FileData) => {
  if (!window.confirm(`Delete ${file.fileName}?`)) return;

  try {
    // 1️⃣ Delete from Firestore
    await deleteDoc(doc(db, "files", file.id));

    // 2️⃣ Delete from Cloudinary via serverless API
    if (file.publicId) {
      await fetch("/api/delete-cloudinary-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: file.publicId }),
      });
    }

    alert("File deleted successfully");
  } catch (err) {
    console.error("Error deleting file:", err);
    alert("Failed to delete file");
  }
};

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Files</h1>

      {/* Upload Input */}
      <input type="file" onChange={handleFileUpload} className="mb-4 block" />

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-4">
          <p>Uploading: {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading Spinner */}
      {loadingFiles && (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Files List */}
      {!loadingFiles && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {files.length === 0 && !uploading && (
            <p className="text-gray-500 col-span-full">No files uploaded yet.</p>
          )}
          {files.map((file) => (
            <div
              key={file.id}
              className="border p-2 rounded shadow bg-white flex flex-col items-center"
            >
              {file.fileUrl && /\.(jpeg|jpg|gif|png|webp)$/i.test(file.fileUrl) ? (
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  className="w-full h-40 object-cover mb-2"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-600">📄 {file.fileName}</span>
                </div>
              )}

              <a
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2"
              >
                Download / View
              </a>

              <button
                onClick={() => handleDelete(file)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFiles;
