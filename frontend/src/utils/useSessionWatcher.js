import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refrescarAccesToken } from "../features/usuario.slice";
import { useDispatch, useSelector } from "react-redux";
import { use } from "react";
import { logout } from "../features/usuario.slice";

export const useSessionWatcher = (token) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(useSelector((state) => state.usuario));

  const expiresAt = useSelector((state) => state.usuario.expiresAt);
  console.log("ExpiresAt:", expiresAt);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const timeLeft = expiresAt - Date.now();
    console.log("Time left:", timeLeft);

    if (timeLeft <= 0) {
      navigate("/");
      return;
    }
    const warningTime = timeLeft - 60_000;

    let warningTimer;

    if (warningTime > 0) {
      warningTimer = setTimeout(() => {
        setShowModal(true);
      }, warningTime);
    } else {
      setShowModal(true);
    }

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [expiresAt, navigate]);

  const handleConfirm = async () => {
    try {
      await dispatch(refrescarAccesToken()).unwrap();
      setShowModal(false);
    } catch (error) {
      console.error("Error refrescando token:", error);
      navigate("/");
    }
  };

  const handleCancel = () => {
    dispatch(logout());
    setTimeout(() => {
      setShowModal(false);
      navigate("/");
    }, 2000);
  };

  return { showModal, handleConfirm, handleCancel };
};
