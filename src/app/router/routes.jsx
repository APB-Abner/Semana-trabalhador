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
const Competicao = lazy(() => import('../../pages/Competicao.jsx'));
const CompeticaoHost = lazy(() => import('../../pages/CompeticaoHost.jsx'));
const CompeticaoEntrar = lazy(() => import('../../pages/CompeticaoEntrar.jsx'));
const CompeticaoSala = lazy(() => import('../../pages/CompeticaoSala.jsx'));
const CompeticaoExibicao = lazy(() => import('../../pages/CompeticaoExibicao.jsx'));

function lazyRoute(routeComponent) {
  return (
    <Suspense fallback={<RouteFallback />}>
      {createElement(routeComponent)}
    </Suspense>
  );
}

export const routes = [
  {
    path: '/competicao/exibicao/:pin',
    element: lazyRoute(CompeticaoExibicao),
  },
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
      { path: 'competicao', element: lazyRoute(Competicao) },
      { path: 'competicao/host', element: lazyRoute(CompeticaoHost) },
      { path: 'competicao/host/:pin', element: lazyRoute(CompeticaoHost) },
      { path: 'competicao/entrar', element: lazyRoute(CompeticaoEntrar) },
      { path: 'competicao/sala/:pin', element: lazyRoute(CompeticaoSala) },
      { path: '*', element: <Page404 /> },
    ],
  },
];
