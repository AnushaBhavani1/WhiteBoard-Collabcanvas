import { useEffect, useState , useRef} from "react";

const Chat = ({
  setOpenedChatTab,
  socket,
  messages,
  setMessages,
}) => {

  const [message, setMessage] = useState("");
const messagesEndRef = useRef(null);
  


  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim() !== "") {

      const newMessage = {
        name: "You",
        message,
      };

      setMessages((prev) => [...prev, newMessage]);

      socket.emit("message", { message });

      setMessage("");
    }
  };

  return (
    <div
      className="position-fixed top-0 h-100 text-white bg-dark"
      style={{ width: "400px", left: "0%" }}
    >

      <button
        type="button"
        onClick={() => setOpenedChatTab(false)}
        className="btn btn-light btn-block w-100 mt-5"
      >
        Close
      </button>

      <div
        className="w-100 mt-5 p-2 border border-1 border-white rounded-3"
        style={{
          height: "70%",
          overflowY: "auto",
        }}
      >

        {messages.map((msg, index) => (
          <div
  key={index}
  className={`d-flex my-2 ${
    msg.name === "You"
      ? "justify-content-end"
      : "justify-content-start"
  }`}
>
  <div
    style={{
      backgroundColor:
        msg.name === "You" ? "#0d6efd" : "#343a40",
      color: "white",
      padding: "10px 15px",
      borderRadius: "15px",
      maxWidth: "70%",
      wordWrap: "break-word",
    }}
  >
    <strong>{msg.name}: </strong>
    <div>{msg.message}</div>
  </div>
</div>
        ))}

<div ref={messagesEndRef}></div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="w-100 mt-4 d-flex rounded-3"
      >

        <input
          type="text"
          placeholder="Enter message"
          className="h-100 border-0 rounded-0 py-2 px-4"
          style={{ width: "90%" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary rounded-0"
        >
          Send
        </button>

      </form>

    </div>
  );
};

export default Chat;