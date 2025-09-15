import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import Pages
import HomePage from './pages/HomePage';
import WingPage from './pages/WingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import EventsPage from './pages/EventsPage';

// Import Components
import Navbar from './components/layout/Navbar';
import ScrollProgressIndicator from './components/ui/ScrollProgressIndicator';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const location = useLocation();
  // State to manage the loading screen
  const [loading, setLoading] = useState(true);

  // Effect to hide the loading screen after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Conditionally render the loading screen */}
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      
      {/* Conditionally render the main website content when not loading */}
      {!loading && (
        <>
          <ScrollProgressIndicator />
          <Navbar />
          <main>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/wing/:wingType" element={<WingPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </>
      )}
    </>
  );
}

export default App;