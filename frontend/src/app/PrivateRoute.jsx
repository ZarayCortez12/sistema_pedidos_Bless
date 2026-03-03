import { isTokenValid } from "../utils/auth";
import { useSessionWatcher } from "../utils/useSessionWatcher";
import ExpireModal from "../components/ExpireModal";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { obtenerUsuarioActual } from "../features/usuario.slice";
import { all } from "axios";

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.usuario.usuario);
  const [redirectHome, setRedirectHome] = useState(false);
  const { showModal, handleConfirm, handleCancel } = useSessionWatcher();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(obtenerUsuarioActual())
      .unwrap()
      .then(() => setLoading(false))
      .catch((err) => {
        console.log("Error obteniendo usuario actual:", err);
        setRedirectHome(true);
        setLoading(false);
      });
  }, [dispatch]);

  if (redirectHome) return <Navigate to="/" replace />;

  if (loading || !usuario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#1a2e4c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(usuario.rol_activo)) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Outlet />
      {showModal && (
        <ExpireModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
};

export default PrivateRoute;
