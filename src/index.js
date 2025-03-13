import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the 'react-dom/client' module
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { StateProvider } from './context/StateContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <>
    <AuthProvider>
      <StateProvider>
        <App />
      </StateProvider>
    </AuthProvider>
  </>
); // Render the App component
