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
        {/* Main pages */}
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/tracker/:token" element={<Tracker />} />
        
        {/* Blog */}
        <Route path="/blogs/kikis-blog" element={<BlogListPage />} />
        <Route path="/blogs/kikis-blog/:slug" element={<BlogPostPage />} />
        
        {/* Pages - matching Shopify URL structure */}
        <Route path="/pages/faq" element={<FAQPage />} />
        <Route path="/pages/contact" element={<ContactPage />} />
        <Route path="/media-kit" element={<MediaKitPage />} />
        <Route path="/emails" element={<EmailPreviews />} />
        
        {/* Policies - matching Shopify URL structure */}
        <Route path="/policies/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/policies/terms-of-service" element={<TermsPage />} />
        <Route path="/policies/shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="/policies/refund-policy" element={<RefundPolicyPage />} />
      </Routes>
    </Router>
  );
}

export default App;