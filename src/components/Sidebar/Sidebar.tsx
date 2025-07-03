import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import tinsaLogo from "../../assets/logo-tinsa.svg"; // Asegúrate de tener el logo en la ruta correcta

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/cargar-documentos", label: "Cargar Archivos", icon: "📁" },
  // Agrega más si lo necesitas
];

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  function click() {
    onClose();
    alert(isOpen);
  }

  return (
    <>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        onClick={click}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      {/* {isOpen && ( */}
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between h-16 bg-gray-800 border-b border-gray-700 px-6">
            <img src={tinsaLogo} className="h-6 me-3 sm:h-7" alt="Tinsa Logo" />

            <button
              className="md:hidden text-2xl"
              onClick={onClose}
              aria-label="Cerrar menú"
              type="button"
            >
              &times;
            </button>
          </div>
          <nav className="mt-8">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={onClose}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
      {/* )} */}
      {/* <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
  
      <aside
        className={`fixed left-0 top-0 z-50 w-64 h-screen bg-gray-900 text-white transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <div className="flex items-center justify-between h-16 bg-gray-800 border-b border-gray-700 px-6">
          <h1 className="text-xl font-bold tracking-wide">MiApp</h1>
          
          <button
            className="md:hidden text-2xl"
            onClick={onClose}
            aria-label="Cerrar menú"
            type="button"
          >
            &times;
          </button>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={onClose}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </aside> */}
    </>
  );
};

export default Sidebar;
