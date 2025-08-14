import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  createdAt: any;
  uid: string;
  displayName: string;
  photoURL: string;
}

const Chat: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: currentUser?.uid,
      displayName: currentUser?.displayName || "Anonymous",
      photoURL: currentUser?.photoURL || "",
    });

    setNewMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">General Chat</h1>

      {/* Messages */}
      <div className="border rounded p-4 h-[400px] overflow-y-auto bg-gray-50 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 mb-3">
            {msg.photoURL && (
              <img
                src={msg.photoURL}
                alt={msg.displayName}
                className="w-10 h-10 rounded-full object-cover border"
              />
            )}
            <div>
              <div className="font-semibold">{msg.displayName}</div>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
