import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user")!);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      className="w-full max-w-7xl  mx-auto p-6 bg-gray-50 min-h-screen"
      style={{
        paddingTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido de vuelta, {user?.name}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Usuarios Activos
              </p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
        {/* Más cards... */}
      </div>

      {/* Contenido adicional */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <p className="text-gray-600">
          Aquí puedes mostrar la actividad reciente del usuario...
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
