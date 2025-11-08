import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import '@uploadcare/react-uploader/core.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* This BrowserRouter is required for routing hooks to work */}
    <BrowserRouter>
      <AuthProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);