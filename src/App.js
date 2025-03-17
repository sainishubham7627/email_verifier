import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';
import { Home } from './components/Home';
import About from './components/About';
import NoteState from './Context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useEffect, useState } from 'react';
import AddNote from './components/AddNote';

function App() {
  const [alert, setAlert] = useState(null);
  const [socket, setSocket] = useState(null);

  // Function to show alert messages
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 1500)
  }

  // WebSocket Connection
  useEffect(() => {
    const newSocket = new WebSocket("wss://noteify-h79j.onrender.com/ws");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket Connected");
    };

    newSocket.onmessage = (event) => {
      console.log("Received:", event.data);
    };

    newSocket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    // Cleanup on component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert} />
          <div className='container'>
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} />} />
              <Route exact path="/addnote" element={<AddNote showAlert={showAlert} />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login showAlert={showAlert} />} />
              <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
