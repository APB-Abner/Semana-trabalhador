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
    <div className="flex min-h-screen flex-col bg-slate-50 text-gray-950 transition-colors dark:bg-zinc-950 dark:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
