import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FaUserShield } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { Users, Layers, Gavel, Clock, Eye, ShoppingCart } from "lucide-react";
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
import dayjs from "dayjs";
import { m, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarioActual } from "../features/usuario.slice";
import { listarProductos } from "../features/productos.slice";
import { listarClientes } from "../features/clientes.slice";
import {
  listarPedidos,
  listarPedidosDeCliente,
} from "../features/pedidos.slice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

function KpiCard({ titulo, valor, Icon, colorGradient, onClick, isFeatured }) {
  return (
    <motion.div
      whileHover={onClick ? { y: -5, scale: 1.02 } : { y: -5 }}
      onClick={onClick}
      className={`rounded-2xl shadow-sm flex items-center justify-between border transition-all duration-300 ${
        isFeatured
          ? `bg-gradient-to-br ${colorGradient} border-transparent text-white shadow-emerald-200 p-4! md:p-6!`
          : "bg-white border-gray-100 text-gray-800 p-3! md:p-4.5!"
      } ${onClick ? "cursor-pointer hover:shadow-md" : ""}`}
    >
      <div className="min-w-0">
        <p
          className={`text-[10px] md:text-xs font-bold uppercase tracking-widest font-montserrat ${
            isFeatured ? "text-emerald-100" : "text-gray-400"
          }`}
        >
          {titulo}
        </p>
        <p
          className={`text-2xl md:text-4xl font-black font-poppins mt-1 break-words ${
            isFeatured ? "text-white" : "text-gray-800"
          }`}
        >
          {valor}
        </p>
      </div>

      <div
        className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 ml-2 ${
          isFeatured
            ? "bg-white/20 backdrop-blur-md"
            : `bg-gradient-to-br ${colorGradient}`
        }`}
      >
        <Icon
          className={isFeatured ? "text-white" : "text-white"}
          size={isFeatured ? 32 : 24}
        />
      </div>
    </motion.div>
  );
}

function Inicio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usuario = useSelector((state) => state.usuario.usuario);
  const productos = useSelector((state) => state.productos.productos);
  const clientes = useSelector((state) => state.clientes.clientes);
  const pedidos = useSelector((state) => state.pedidos.pedidos);
  const pedidosCliente = useSelector((state) => state.pedidos.pedidosCliente);

  useEffect(() => {
    if (!usuario) {
      dispatch(obtenerUsuarioActual());
    }

    document.title = "Organización Bless | Inicio";

    dispatch(listarProductos());
    dispatch(listarClientes());
    dispatch(listarPedidos());
  }, []);

  console.log("Clientes:", clientes);

  const clientesFrecuentes = clientes
    .map((cliente) => {
      const numPedidos = pedidos.filter(
        (p) => p.clienteId === cliente.id,
      ).length;
      return { ...cliente, totalPedidos: numPedidos };
    })
    .sort((a, b) => b.totalPedidos - a.totalPedidos)
    .slice(0, 3);

  const totalVentasFormateado = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(pedidos.reduce((acc, p) => acc + (p.total || 0), 0));

  const datosGrafico = Object.values(
    pedidos.reduce((acc, pedido) => {
      const fecha = dayjs(pedido.fecha).format("DD MMM");
      if (!acc[fecha]) {
        acc[fecha] = { fecha, total: 0, cantidad: 0 };
      }
      acc[fecha].total += pedido.total;
      acc[fecha].cantidad += 1;
      return acc;
    }, {}),
  ).sort((a, b) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix());

  if (usuario.rol_activo === "administrador") {
    return (
      <div className="p-2 w-full animate-fadeIn">
        <div className="flex items-center mb-3">
          <IoMdArrowDropright className="text-red-600" size={35} />
          <h1 className="text-xl font-montserrat font-bold -ml-1!">
            Panel de Control
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 -mt-2.5!">
          <div className="lg:col-span-1">
            <KpiCard
              titulo="Ingresos Totales (Acumulado)"
              valor={totalVentasFormateado}
              Icon={TrendingUp}
              colorGradient="from-emerald-600 to-teal-500"
              isFeatured={true}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <KpiCard
                titulo="Productos Registrados"
                valor={productos.length}
                Icon={Layers}
                colorGradient="from-red-600 to-red-400"
                onClick={() => {
                  localStorage.setItem("selectedMenuKey", "productos");
                  navigate("/administrador/productos");
                }}
              />

              <KpiCard
                titulo="Clientes Registrados"
                valor={clientes.length}
                Icon={Users}
                colorGradient="from-orange-500 to-orange-300"
                onClick={() => {
                  localStorage.setItem("selectedMenuKey", "clientes");
                  navigate("/administrador/clientes");
                }}
              />

              <KpiCard
                titulo="Pedidos Registrados"
                valor={pedidos.length}
                Icon={ShoppingCart}
                colorGradient="from-gray-800 to-gray-600"
                onClick={() => {
                  localStorage.setItem("selectedMenuKey", "pedidos");
                  navigate("/administrador/pedidos");
                }}
              />
            </div>
          </div>
        </div>
        <div className="-mt-4!">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 font-montserrat flex items-center gap-2">
                  <ShoppingCart className="text-blue-500" size={20} />
                  Volumen de Actividad Diaria
                </h3>
                <p className="text-xs text-gray-400 font-medium font-inter">
                  Cantidad de pedidos y valor total recaudado por día
                </p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={datosGrafico}>
                    <defs>
                      <linearGradient
                        id="colorCantidad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="fecha"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      dy={10}
                    />
                    <YAxis hide allowDecimals={false} />

                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "15px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        padding: "12px",
                      }}
                      formatter={(value, name, props) => {
                        const { total } = props.payload;
                        const totalFormateado = new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        }).format(total);

                        return [
                          <div
                            key="tooltip-content"
                            className="flex flex-col gap-1"
                          >
                            <span className="font-bold text-blue-600">
                              {value} Pedidos
                            </span>
                            <span className="text-gray-500 text-xs font-semibold">
                              Venta total: {totalFormateado}
                            </span>
                          </div>,
                          null,
                        ];
                      }}
                      labelStyle={{
                        fontWeight: "bold",
                        color: "#1e293b",
                        marginBottom: "5px",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="cantidad"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      fill="url(#colorCantidad)"
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 font-montserrat flex items-center gap-2">
                  <UserCheck className="text-orange-500" size={20} />
                  Clientes Frecuentes
                </h3>
                <p className="text-xs text-gray-400 font-medium font-inter">
                  Top 4 con más pedidos
                </p>
              </div>

              <div className="space-y-4 flex-1">
                {clientesFrecuentes.map((cliente, index) => (
                  <div
                    key={cliente.id}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-montserrat text-sm ${
                          index === 0
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cliente.nombres.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate w-32 md:w-full font-poppins">
                          {cliente.nombres}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-tighter font-inter">
                          {cliente.email || "Sin correo"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-blue-50 text-blue-600 text-sm font-black px-2.5 py-1 rounded-lg font-poppins">
                        {cliente.totalPedidos}
                      </span>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 font-inter">
                        Pedidos
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/administrador/clientes")}
                className="mt-4 w-full py-3 rounded-xl bg-gray-50 text-gray-500 text-xs font-bold hover:bg-gray-100 transition-all font-montserrat"
              >
                VER TODOS LOS CLIENTES
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <FaUserShield className="text-blue-900" size={60} />
      <h1 className="text-[2.5rem] font-bold font-poppins mt-2.5">
        ¡Bienvenido de nuevo!
      </h1>
      <p className="text-[1.2rem] text-[#666] mt-2.5">
        Explora las opciones del menú para comenzar
        a navegar por el sistema.
      </p>
    </div>
  );
}

export default Inicio;
