import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import { trackRouteVisit } from '../../features/analytics/lib/analytics.js';

export default function MainLayout() {
  const location = useLocation();
  const isCompetitionSurface = location.pathname.startsWith('/competicao');

  useEffect(() => {
    trackRouteVisit(location.pathname);
  }, [location.pathname]);

  return (
    <div className={`flex min-h-screen flex-col bg-slate-50 text-gray-950 transition-colors dark:bg-[#070a0f] dark:text-white ${isCompetitionSurface ? 'h-screen overflow-hidden' : ''}`}>
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>
      {!isCompetitionSurface && <Navbar />}
      <main id="conteudo-principal" className={`flex-1 ${isCompetitionSurface ? 'min-h-0 overflow-hidden' : ''}`} tabIndex={-1}>
        <Outlet />
      </main>
      {!isCompetitionSurface && <Footer />}
    </div>
  );
}
