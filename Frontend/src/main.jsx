import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App.jsx';
import { SocketProvider } from './contexts/SocketContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

// Send cookies with cross-origin API requests (e.g. cookie set by backend on login)
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <SocketProvider>
        <App />
      </SocketProvider>
    </StrictMode>
  </BrowserRouter>
);