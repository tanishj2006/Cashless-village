import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Landing from "./pages/Landing";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import Impact from "./pages/Impact";
import Security from "./pages/Security";
import ModuleDetail from "./pages/ModuleDetail";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Generate or get session ID
export const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = "user_" + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

// Main App component
function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await axios.post(`${API}/init-data`);
        setInitialized(true);
      } catch (e) {
        console.error("Error initializing data:", e);
        setInitialized(true); // Continue anyway
      }
    };
    initializeData();
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Main application routes
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:moduleId" element={<ModuleDetail />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// Export the App component as default
export default App;
