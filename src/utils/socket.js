const socket = new WebSocket("wss://noteify-h79j.onrender.com/ws");

socket.onopen = () => {
  console.log("Connected to WebSocket Server ✅");
};

socket.onmessage = (event) => {
  console.log("Received message:", event.data);
};

socket.onerror = (error) => {
  console.error("WebSocket Error:", error);
};

socket.onclose = () => {
  console.log("WebSocket Disconnected ❌");
};

export default socket;
