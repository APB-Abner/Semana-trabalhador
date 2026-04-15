import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../../pages/Home.jsx';
import Testes from '../../pages/Testes.jsx';
import Mapa from '../../pages/Mapa.jsx';
import Historias from '../../pages/Historias.jsx';
import Game from '../../pages/Game.jsx';
import Dicas from '../../pages/Dicas.jsx';
import Page404 from '../../pages/404.jsx';

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'testes', element: <Testes /> },
      { path: 'mapa', element: <Mapa /> },
      { path: 'historias', element: <Historias /> },
      { path: 'game', element: <Game /> },
      { path: 'dicas', element: <Dicas /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
