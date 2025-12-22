import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewLandingPage from './NewLandingPage';
import Tracker from './TrackerPage';
import AdminCMS from './AdminCMS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/tracker/:token" element={<Tracker />} />
        <Route path="/admin/cms" element={<AdminCMS />} />
        <Route path="/blogs/kikis-blog" element={<div>Blog Collection - Pull from Git</div>} />
        <Route path="/blogs/kikis-blog/:slug" element={<div>Blog Article - Pull from Git</div>} />
        
        {/* Pages */}
        <Route path="/pages/faq" element={<div>FAQ - Pull from Git</div>} />
        <Route path="/pages/contact" element={<div>Contact Us - Pull from Git</div>} />
        
        {/* Policies */}
        <Route path="/policies/privacy-policy" element={<div>Privacy Policy - Pull from Git</div>} />
        <Route path="/policies/terms-of-service" element={<div>Terms of Service - Pull from Git</div>} />
        <Route path="/policies/shipping-policy" element={<div>Shipping Policy - Pull from Git</div>} />
        <Route path="/policies/refund-policy" element={<div>Refund Policy - Pull from Git</div>} />
      </Routes>
    </Router>
  );
}

export default App;