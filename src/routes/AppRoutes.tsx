import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// Páginas
import Login from "../components/Login/Login";
import Dashboard from "../pages/Dashboard";
import DocumentUploadForm from "../components/DocumentUploadForm/DocumentUploadForm";
import ProductList from "../components/ProductionGuide/ProductionGuide";

const AppRoutes: React.FC = () => {
  // const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/documentupload" element={<DocumentUploadForm />} />
      <Route path="/production-guide" element={<ProductList />} />

      {/* Redirige cualquier ruta no autenticada al login */}
      {/* <Route
        path="*"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      {/* Redirige la ruta raíz al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Cualquier otra ruta no encontrada */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
