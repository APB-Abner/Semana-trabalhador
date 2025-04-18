import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-white transition-colors">
      <Navbar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer className="bg-gray-800 dark:bg-zinc-700 text-white p-4 text-center" />
    </div>
  );
}
