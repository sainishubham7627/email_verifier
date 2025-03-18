const socket = new WebSocket("wss://noteify-h79j.onrender.com/ws");

socket.onopen = () => console.log("Connected");

socket.onmessage = (event) => console.log("Message:", event.data);

socket.onerror = (error) => console.error("Error:", error);

socket.onclose = () => console.log("Disconnected");

export default socket;
