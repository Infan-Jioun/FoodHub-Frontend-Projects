import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Components/Routes/Routes/Routes';
import AuthProvider from './Components/Provider/AuthProvider/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactGA from 'react-ga4';
import { motion } from 'framer-motion';
import { FiX, FiArrowRight, FiWifiOff, FiAlertCircle } from 'react-icons/fi';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from '@material-tailwind/react';

const queryClient = new QueryClient();
ReactGA.initialize('G-H44B4H16F7');

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center">
          <FiAlertCircle className="text-[#ff1818] text-5xl mb-4" />
          <Typography variant="h4" className="text-[#ff1818] mb-2">
            Oops! Something went wrong.
          </Typography>
          <Typography className="text-gray-700 mb-6">
            Please refresh the page to continue.
          </Typography>
          <Button onClick={() => window.location.reload()} className="bg-[#ff1818] text-white">
            Refresh
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Offline Detector
const OfflineDetector = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  if (isOnline) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className=" bg-red-100 border-l-4 border-[#ff1818] text-[#ff1818] p-4 rounded-lg shadow-lg flex items-start"
      >
        <FiWifiOff className="text-[#ff1818] text-xl  mr-3 mt-0.5" />
        <div>
          <p className="font-bold">You're offline</p>
          <p className="text-sm">Some features may not work</p>
        </div>
      </motion.div>
    </div>
  );
};

// Loader
const Loader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-white"
  >
    <motion.img
      src="https://i.ibb.co.com/F57mtch/logo2.png"
      alt="Logo"
      className="w-28 h-28"
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div
      className="mt-6 text-lg font-semibold text-[#ff1818]"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >

    </motion.div>
  </motion.div>
);

// Main App
// Main App
const AppWithLoader = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      // Check if modal was already shown
      const modalShown = localStorage.getItem('modalShown');
      if (!modalShown) {
        setShowModal(true);
        localStorage.setItem('modalShown', 'true');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <OfflineDetector />
          <RouterProvider router={router} />
          <Dialog open={showModal} className=''>
            <DialogHeader className="bg-[#ff1818] text-white rounded-lg drop-shadow-2xl">
              <div className="flex justify-between items-center w-full font-Poppins">
                <Typography variant="h4">Welcome to FOODHUB!</Typography>
                <FiX onClick={() => setShowModal(false)} className="cursor-pointer" />
              </div>
            </DialogHeader>
            <DialogBody>
              <div className="text-center">
                <img
                  src="https://i.ibb.co.com/F57mtch/logo2.png"
                  alt="Logo"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <Typography variant="lead" className="text-gray-700 mb-4">
                  Discover food, restaurants & seamless delivery
                </Typography>
              </div>
              <div className="bg-red-50 rounded-lg p-4 mb-2">
                <Typography variant="h6" className="text-[#ff1818]">Admin</Typography>
                <Typography className="text-sm">Email: foodhub@admin.com | Pass: 12345678</Typography>
              </div>
              <div className="bg-red-50 rounded-lg p-4 mb-2">
                <Typography variant="h6" className="text-[#ff1818]">Moderator</Typography>
                <Typography className="text-sm">Email: foodhub@moderator.com | Pass: 12345678</Typography>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <Typography variant="h6" className="text-[#ff1818]">Restaurant</Typography>
                <Typography className="text-sm">Email: 7dayz@restaurant.com | Pass: 12345678</Typography>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                onClick={() => setShowModal(false)}
                className="bg-[#ff1818] hover:bg-[#ff1818] text-white w-full flex justify-center items-center gap-2"
              >
                Get Started <FiArrowRight />
              </Button>
            </DialogFooter>
          </Dialog>
        </>
      )}
    </>
  );
};

// Render Everything
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <div className="font-Poppins bg-white text-black min-h-screen">
            <AppWithLoader />
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
