import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminPage from './AdminPage';
import IntentLandingTemplate from './IntentLandingTemplate';
import ToothFairyGiftPage from './ToothFairyGiftPage';
import NotFoundPage from './NotFoundPage';
import { usePageTracking } from './hooks/usePageTracking';
import { captureAttribution } from './lib/attribution';
import { useJourneyTracking } from './hooks/useJourneyTracking';

function PageTracker() {
  usePageTracking();
  useJourneyTracking();

  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <PageTracker />
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

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/cms" element={<AdminPage />} />

        {/* Templates (draft, noindex) */}
        <Route path="/templates/intent-landing" element={<IntentLandingTemplate />} />

        {/* SEO Landing Pages */}
        <Route path="/tooth-fairy-gift" element={<ToothFairyGiftPage />} />

        {/* Convenience redirects */}
        <Route path="/blog" element={<Navigate to="/blogs/kikis-blog" replace />} />
        <Route path="/blogs/kikis-blog/is-the-tooth-fairy-real-what-to-say-when-kids-ask" element={<Navigate to="/blogs/kikis-blog/is-the-tooth-fairy-real" replace />} />
        <Route path="/privacy" element={<Navigate to="/policies/privacy-policy" replace />} />
        <Route path="/terms" element={<Navigate to="/policies/terms-of-service" replace />} />
        <Route path="/shipping" element={<Navigate to="/policies/shipping-policy" replace />} />
        <Route path="/refund" element={<Navigate to="/policies/refund-policy" replace />} />
        <Route path="/faq" element={<Navigate to="/pages/faq" replace />} />
        <Route path="/contact" element={<Navigate to="/pages/contact" replace />} />

        {/* 404 catch-all - must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;