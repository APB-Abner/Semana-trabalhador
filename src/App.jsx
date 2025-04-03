import { useState } from 'react'
import { Outlet } from "react-router-dom";


export default function App() {
  return (
    <div>
      <ScrollToTop />
      <Outlet />
    </div>
  );
}
