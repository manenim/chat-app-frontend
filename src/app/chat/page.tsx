"use client";

import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function ChatMessage() {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState("");

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [currentGroup, setCurrentGroup] = useState(""); // define currentGroup state

  useEffect(() => {
    if (socket.connected) {
      console.log("connected user" + socket.id);
      onConnect();
    }

    console.log(socket);

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.emit("message", "Hello from client");
      socket.emit("getAllMessages", currentGroup);

      socket.on("messages", (msgs) => {
        console.log("messages", msgs);
        setMessages(msgs);
      });

      socket.on("savedMessage", (msg) => {
        socket.emit("getAllMessages", msg);
      });

      socket.io.engine.on("upgrade", (transport) => {
        console.log("transport", transport);
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("newMessage", { message: newMessage, group: currentGroup });
      setNewMessage("");
    }
  };

  const handleJoinGroup = (groupName: string) => {
    socket.emit("join_group", groupName);
    setCurrentGroup(groupName);
    socket.emit("getAllMessages", currentGroup);
  };


  return (
    <div className="bg-gray-300 p-4 md:p-8 text-gray-800 min-h-screen flex flex-col justify-between">
      <h1 className="font-bold text-2xl mb-12 text-center mt-12 lg:mt-4">
        Chat :{" "}
      </h1>

      <div className="max-w-2xl w-full h-full items-center justify-center  mt-12">
        <div className="messages-container overflow-y-auto flex-grow mb-6 bg-gray-200 rounded p-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>

          {/* buttons to join groups */}
          <div className="flex space-x-4 mt-4">
            <button onClick={() => handleJoinGroup("programming")}>
              Join Programming
            </button>
            <button onClick={() => handleJoinGroup("dsa")}>Join DSA</button>
            <button onClick={() => handleJoinGroup("networks")}>
              Join Networks
            </button>
          </div>

          <div className="flex flex-col h-full">
            {messages.map((msg: any, index: any) => (
              <p key={index} className="mb-2 text-red-800 font-bold text-3xl">
                {msg.message} - <small>sent from{msg.senderId}</small>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
