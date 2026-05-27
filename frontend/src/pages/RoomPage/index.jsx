import React, { useState,useRef ,useEffect} from "react";
import WhiteBoard from "../../components/Whiteboard";
import './index.css' 
import Chat from "../../components/ChatBar/index"
const RoomPage = ({user,socket ,users}) => {

    const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const[history,setHistory] =useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(false);

  const [openedChatTab, setOpenedChatTab] = useState(false);
const [messages, setMessages] = useState([]);

useEffect(() => {

  const handleMessage = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  socket.on("messageResponse", handleMessage);

  return () => {
    socket.off("messageResponse", handleMessage);
  };

}, [socket]);
const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white";
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setElements([]);
  };

const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };

  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  return (
    <div className="row">
      
      <div
  className="d-flex gap-2 flex-wrap px-4 pt-3"
>
  <button
    type="button"
    className="btn btn-dark"
    onClick={() => setOpenedUserTab(true)}
  >
    Users
  </button>

  <button
    type="button"
    className="btn btn-primary"
    onClick={() => setOpenedChatTab(true)}
  >
    Chats
  </button>
</div>
      {openedUserTab && (
        <div
          className="position-fixed top-0 h-100 text-white bg-dark"
          style={{ width: "250px", left: "0%" }}
        >
          <button
            type="button"
           onClick={() => setOpenedUserTab(false)}
            className="btn btn-light btn-block w-100 mt-5"
          >
            Close
          </button>
          <div className="w-100 mt-5 pt-5">
            {users.map((usr, index) => (
              <p key={index * 999} className="my-2 text-center w-100 ">
                {usr.name} {user && user.userId === usr.userId && "(You)"}
              </p>
            ))}
          </div>
        </div>
      )}
     {openedChatTab && (
  <Chat
    setOpenedChatTab={setOpenedChatTab}
    socket={socket}
    messages={messages}
    setMessages={setMessages}
  />
)}
      <div className="d-flex justify-content-between align-items-center py-4 px-5">
  
  <h1
    style={{
      fontFamily: "'Trebuchet MS', sans-serif",
      fontWeight: "bold",
      fontSize: "42px",
      background: "linear-gradient(to right, #0d6efd, #6610f2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "2px",
      margin: 0,
    }}
  >
    CollabCanvas
  </h1>

  <button
    className="btn btn-primary px-4 py-2"
    style={{
      borderRadius: "25px",
      fontWeight: "bold",
      fontSize: "16px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    }}
  >
    Users Online : {users.length}
  </button>

</div>

    {user?.presenter && (
        <div className="col-md-10 mx-auto px-5 mb-3 d-flex align-items-center jusitfy-content-center">
          <div className="d-flex col-md-2 justify-content-center gap-1">
            <div className="d-flex gap-1 align-items-center">
              <label htmlFor="pencil">Pencil</label>
              <input
                type="radio"
                name="tool"
                id="pencil"
                checked={tool === "pencil"}
                value="pencil"
                className="mt-1"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>

          {/* Line */}
          <div className="d-flex gap-1 align-items-center">
            <label htmlFor="line">Line</label>
            <input
              type="radio"
              name="tool"
              id="line"
              value="line"
              checked={tool === "line"}
              className="mt-1"
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
          <div className="d-flex  gap-1 align-items-center">
              <label htmlFor="rect">Rectangle</label>
              <input
                type="radio"
                name="tool"
                id="rect"
                checked={tool === "rect"}
                value="rect"
                className="mt-1"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
        </div>
        <div className="col-md-3 mx-auto ">
            <div className="d-flex align-items-center justify-content-center">
              <label htmlFor="color">Select Color: </label>
              <input
                type="color"
                id="color"
                className="mt-1 ms-3"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button
              className="btn btn-primary mt-1"
              disabled={elements.length === 0}
              onClick={() => undo()}
            >
              Undo
            </button>
            <button
              className="btn btn-outline-primary mt-1"
              disabled={history.length < 1}
             onClick={() => redo()}
            >
              Redo
            </button>
          </div>
           <div className="col-md-2">
            <button className="btn btn-danger" 
           onClick={handleClearCanvas}
            >
              Clear Canvas
            </button>
          </div>
      </div>
      
)}
       <div className="col-md-10 mx-auto mt-4 canvas-box">
        <WhiteBoard canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          color={color}
          user={user}
          socket={socket}
          
          />
        </div>
    </div>
  );
};

export default RoomPage;

