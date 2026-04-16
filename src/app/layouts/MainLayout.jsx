import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import { trackRouteVisit } from '../../features/analytics/lib/analytics.js';

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    trackRouteVisit(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-white transition-colors">
      <Navbar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
