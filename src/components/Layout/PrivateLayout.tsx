import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Botón hamburguesa solo en móvil */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
        type="button"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      {/* <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

      {/* Contenido principal */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">{children}</main>
    </div>
  );
};

export default PrivateLayout;
