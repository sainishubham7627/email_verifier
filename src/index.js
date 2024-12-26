import React from 'react';
import ReactDOM from 'react-dom/client';  // Import the new React 18 root API
import App from './App';
import './index.css'; // Or './App.css' if you are using App.css for styles


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
