"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
  const socket = io("http://localhost:5000/events");
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState("");

  // const eventSource = new EventSource("http://localhost:5000/events/sse");
  // eventSource.onmessage = ({ data }) => {
  //   console.log("New message", JSON.parse(data));
  // };

  useEffect(() => {
    console.log("hey");
    console.log(socket);
    socket.emit("findAllMessages", {}, (data: any) =>
      setMessages((prevMessages: any) => [...prevMessages, data])
    );

    return () => {
      socket.disconnect();
    };
  });

  socket.on("clientMessage", (data: any) => {
    setMessages((prevMessages: any) => [...prevMessages, data]);
  });

  console.log(newMessage);
  console.log(messages);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hello
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
      <button
        onClick={() => {
          socket.emit("createMessage", newMessage, (data: any) =>
            console.log(data, "new data")
          );
          setNewMessage("");
        }}>
        Send
      </button>
      <div></div>
    </main>
  );
}
