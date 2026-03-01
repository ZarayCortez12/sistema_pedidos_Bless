import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refrescarAccesToken } from "../features/usuario.slice";
import { useDispatch, useSelector } from "react-redux";

export const useSessionWatcher = (token) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { usuario, expiresAt } = useSelector((state) => state.usuario);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!expiresAt) return; // Aún no se ha iniciado sesión

    const timeLeft = expiresAt - Date.now();

    // Si ya expiró → cerrar sesión inmediatamente
    if (timeLeft <= 0) {
      navigate("/");
      return;
    }

    // Tiempo para abrir el modal (1 minuto antes de expirar)
    const warningTime = timeLeft - 60_000;

    let warningTimer;

    if (warningTime > 0) {
      warningTimer = setTimeout(() => {
        setShowModal(true);
      }, warningTime);
    } else {
      // Si ya falta menos de 1 minuto → mostrar modal de una vez
      setShowModal(true);
    }

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [expiresAt, navigate]);

  // Confirmar → refrescar sesión
  const handleConfirm = async () => {
    try {
      await dispatch(refrescarAccesToken()).unwrap();
      setShowModal(false);
    } catch (error) {
      console.error("Error refrescando token:", error);
      navigate("/");
    }
  };

  // Cancelar → cerrar sesión
  const handleCancel = () => {
    setShowModal(false);
    navigate("/");
  };

  return { showModal, handleConfirm, handleCancel };
};
