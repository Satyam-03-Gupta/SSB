import React, { useEffect } from 'react';
import FeedbackPage from '../components/FeedbackPage';
import Footer from '../components/Footer';
import { setPageTitle } from '../lib/util';

const FeedbackPageWrapper = () => {
  useEffect(() => {
    setPageTitle('Feedback - Share Your Experience');
  }, []);

  return (
    <>
      <FeedbackPage />
      <Footer />
    </>
  );
};

export default FeedbackPageWrapper;