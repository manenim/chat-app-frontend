"use client";

import { set } from "mongoose";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
  const ws = new WebSocket("http://localhost:5000/events");
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState("");
  const [events, setEvents] = useState<any>([]);

  const eventSource = new EventSource("http://localhost:5000/events");

  eventSource.onmessage = (event) => {
    console.log(event.data);
    setEvents([...events, event.data]);
  };

  console.log(events)

  eventSource.addEventListener("book-saved", (event) => {
    console.log("Book saved successfully!");
  });

  eventSource.onerror = (error) => {
    console.error(error);
  };

  eventSource.onopen = () => {
    console.log("Connection established");
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
      <button>Send</button>
    </main>
  );
}
