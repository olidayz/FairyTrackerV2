import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewLandingPage from './NewLandingPage';
import Tracker from './TrackerPage';
import BlogListPage from './BlogListPage';
import BlogPostPage from './BlogPostPage';
import MediaKitPage from './MediaKitPage';
import EmailPreviews from './EmailPreviews';
import FAQPage from './FAQPage';
import ContactPage from './ContactPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsPage from './TermsPage';
import ShippingPolicyPage from './ShippingPolicyPage';
import RefundPolicyPage from './RefundPolicyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/media-kit" element={<MediaKitPage />} />
        <Route path="/emails" element={<EmailPreviews />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/shipping" element={<ShippingPolicyPage />} />
        <Route path="/refund" element={<RefundPolicyPage />} />
      </Routes>
    </Router>
  );
}

export default App;