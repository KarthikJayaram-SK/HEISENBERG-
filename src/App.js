import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import './App.css';

// Import Pages
import HomePage from './pages/HomePage';
import WingPage from './pages/WingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import EventsPage from './pages/EventsPage';
import AdminSlideshowPage from './pages/AdminSlideshowPage';
import ReportsPage from './pages/ReportsPage';
import AdminGalleryPage from './pages/AdminGalleryPage';
import GalleryPage from './pages/GalleryPage';

// Import Components
import Navbar from './components/layout/Navbar';
import ScrollProgressIndicator from './components/ui/ScrollProgressIndicator';
import LoadingScreen from './components/ui/LoadingScreen';
import SocialLinks from './components/ui/SocialLinks'; // ✨ 1. Import the new component

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      
      {!loading && (
        <>
          <ScrollProgressIndicator />
          <Navbar />
          <SocialLinks /> {/* ✨ 2. Add the component here */}
          <main className="main-content">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/wing/:wingType" element={<WingPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/admin/slideshow" element={<AdminSlideshowPage />} />
                <Route path="/admin/gallery" element={<AdminGalleryPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </>
      )}
    </>
  );
}

export default App;