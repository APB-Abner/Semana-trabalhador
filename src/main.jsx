import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import Home from './pages/Home.jsx'
import Testes from './pages/Testes.jsx'
import Mapa from './pages/Mapa.jsx'
import Historias from './pages/Historias.jsx'
import Game from './pages/Game.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/testes", element: < Testes /> },
      { path: "/mapa", element: < Mapa /> },
      { path: "/historias", element: < Historias /> },
      { path: "/game", element: < Game /> },
      { path: '*', element: <PageNotFound /> },
      // { path: ':name', element: <ContentPage /> }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

