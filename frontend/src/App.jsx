import React, { useState, useEffect } from "react";
import Forms from "./components/Forms";
import { Route, Routes } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const server = "https://whiteboard-collabcanvas.onrender.com";

const connectionOptions = {
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // ---------------- USER JOINED ----------------
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        setUsers(data.users);
      }
    });

    // ---------------- ALL USERS ----------------
    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    // ---------------- USER JOIN MESSAGE ----------------
    socket.on("userJoinedMessageBroadcasted", (data) => {
      toast.info(`${data.name} joined the room`);
    });

    // ---------------- USER LEFT MESSAGE ----------------
    socket.on("userLeftMessageBroadcasted", (data) => {
      toast.info(`${data.name} left the room`);
    });

    // 🧠 IMPORTANT: WHITEBOARD SYNC (MISSING BEFORE)
    socket.on("whiteBoardDataResponse", (data) => {
      console.log("Board update received");

      // send event to RoomPage via custom event
      window.dispatchEvent(
        new CustomEvent("whiteboard-update", {
          detail: data.imgURL,
        })
      );
    });

    // CLEANUP (VERY IMPORTANT)
    return () => {
      socket.off("userIsJoined");
      socket.off("allUsers");
      socket.off("userJoinedMessageBroadcasted");
      socket.off("userLeftMessageBroadcasted");
      socket.off("whiteBoardDataResponse");
    };
  }, []);

  // ---------------- ROOM ID GENERATOR ----------------
  const uuid = () => {
    let S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  return (
    <div className="container">
      <ToastContainer />

      <Routes>
        <Route
          path="/"
          element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}
        />

        <Route
          path="/:roomId"
          element={<RoomPage user={user} socket={socket} users={users} />}
        />
      </Routes>
    </div>
  );
};

export default App;