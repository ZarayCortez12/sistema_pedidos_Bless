import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FaUserShield } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { Users, Layers, Gavel, Clock, Eye } from "lucide-react";
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  UserCheck,
  Activity,
  Zap,
  ShieldAlert,
  CheckCircle2,
  CheckCheck,
  XCircle,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import { m, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function InicioAdministrador() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usuario = useSelector((state) => state.usuario.usuario);
  useEffect(() => {
    document.title = "Organización Bless | Inicio Administrador";
  }, []);


  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <FaUserShield className="text-[#e10318]" size={60} />
      <h1 className="text-[2.5rem] font-bold font-poppins mt-2.5">
        ¡Bienvenido de nuevo, Administrador!
      </h1>
      <p className="text-[1.2rem] text-[#666] mt-2.5">
        Este es tu panel de control. Explora las opciones del menú para comenzar
        a gestionar el sistema.
      </p>
    </div>
  );
}

export default InicioAdministrador;
