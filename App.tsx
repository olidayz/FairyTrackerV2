import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewLandingPage from './NewLandingPage';
import Tracker from './TrackerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/tracker" element={<Tracker />} />
      </Routes>
    </Router>
  );
}

export default App;