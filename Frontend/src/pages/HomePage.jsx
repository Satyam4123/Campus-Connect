import React, { useState, useEffect } from 'react';
import LoginPage from '../components/LOGIN/login';
import AppDownload from '../components/AppDownload/AppDownload';
import Footer from '../components/Footer/Footer';
import { FaAngleDoubleDown } from 'react-icons/fa';

const HomePage = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <LoginPage />
      <AppDownload />
      <Footer />
      {showScrollHint && (
        <div className="fixed bottom-10 right-10 z-50 animate-bounce cursor-pointer" onClick={scrollToBottom}> 
          <FaAngleDoubleDown size={40} className="text-red-500" />
        </div>
      )}
    </div>
  );
};

export default HomePage;