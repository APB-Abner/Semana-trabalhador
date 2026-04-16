import { createElement, lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../../pages/Home.jsx';
import Historias from '../../pages/Historias.jsx';
import Page404 from '../../pages/404.jsx';
import RouteFallback from '../../shared/ui/RouteFallback.jsx';

const Testes = lazy(() => import('../../pages/Testes.jsx'));
const Mapa = lazy(() => import('../../pages/Mapa.jsx'));
const Game = lazy(() => import('../../pages/Game.jsx'));
const Dicas = lazy(() => import('../../pages/Dicas.jsx'));

function lazyRoute(routeComponent) {
  return (
    <Suspense fallback={<RouteFallback />}>
      {createElement(routeComponent)}
    </Suspense>
  );
}

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'testes', element: lazyRoute(Testes) },
      { path: 'mapa', element: lazyRoute(Mapa) },
      { path: 'historias', element: <Historias /> },
      { path: 'game', element: lazyRoute(Game) },
      { path: 'dicas', element: lazyRoute(Dicas) },
      { path: '*', element: <Page404 /> },
    ],
  },
];
