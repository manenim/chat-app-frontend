"use client";

import { set } from "mongoose";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
  const socket = io("http://localhost:5000/events");
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log(socket, "socket");
    socket.emit("findAllMessages", {}, {}, (data: any) => {
      console.log("data");
      setMessages([...messages, data]);
    });

    socket.on("clientMessage", (data: any) => {
      console.log("data is back");
      console.log(data);
      setMessages((prevMessages: any) => [...prevMessages, data]);
    });

    console.log(messages);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    socket.emit(
      "createMessage",
      { name: "mani", text: newMessage },
      (data: any) => setMessages([...messages, data])
    );
    setNewMessage("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Chat App</h1>
      <div>
        {messages.map((message: any, index: any) => (
          <p key={index}>{message.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </main>
  );
}
