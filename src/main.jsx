import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Components/Routes/Routes/Routes';
import AuthProvider from './Components/Provider/AuthProvider/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Circles } from 'react-loader-spinner';
import ReactGA from 'react-ga4';

const queryClient = new QueryClient();

ReactGA.initialize('G-H44B4H16F7');

const Loader = () => (
  <div className="flex justify-center items-center min-h-screen">
      <img
      src="https://i.ibb.co.com/F57mtch/logo2.png"
      alt="Loading Logo"
      className="w-28 h-28 object-contain animate-pulse"
    />
   
  </div>
);

const AppWithLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });
  }, []);
  return loading ? <Loader /> : <RouterProvider router={router} />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <div className="font-Kanit bg-white  text-black">
          <AppWithLoader />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
