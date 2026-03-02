import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { detallesPedido } from "../features/pedidos.slice";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Package,
  User,
  ShoppingCart,
  Calendar,
  CreditCard,
  Store,
  FileText,
} from "lucide-react";
import { Table, Tag, Card, Button, Divider, Skeleton } from "antd";

function DetallesPedido() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const pedido = useSelector((state) => state.pedidos.pedido);
  console.log("Pedido:", pedido);

  useEffect(() => {
    document.title = "Organización Bless | Detalles Pedido";
    dispatch(detallesPedido(id))
      .unwrap()
      .then((res) => {
        console.log("Detalles del pedido:", res);
        toast.success(res.message);
      })
      .catch((err) => {
        console.error("Error al cargar detalles del pedido:", err);
      });
  }, [dispatch]);

  const cantidadTotal = (tallas) => {
    let total = 0;
    tallas.forEach((t) => {
      total += t.cantidad;
    });
    return total;
  };

  const cantidadSubTotal = (tallas) => {
    let total = 0;
    tallas.forEach((t) => {
      total += t.subtotal;
    });
    return total;
  };

  const columns = [
    {
      title: (
        <div className="text-center w-full uppercase tracking-wider font-inter">
          Producto
        </div>
      ),
      dataIndex: "nombre",
      key: "nombre",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#1a2e4c] text-base font-inter uppercase">
            {text}
          </span>
          <div className="flex items-center gap-2">
            <Tag
              color="blue"
              className="m-0 text-[10px] leading-tight px-1 font-inter uppercase"
            >
              REF: {record.codigo || "N/A"}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Cantidad Productos (Talla: Cantidad)",
      key: "tallas",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (tallas) => (
        <div className="flex flex-wrap gap-2">
          {tallas.tallas &&
            tallas.tallas.map((t, index) => (
              <div
                key={index}
                className="flex items-center border border-gray-100 rounded-lg overflow-hidden shadow-sm"
              >
                <span className="bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-600 border-r border-gray-200">
                  {t.nombre}
                </span>
                <span className="bg-white px-2 py-1 text-[11px] font-bold text-red-600">
                  {t.cantidad}
                </span>
              </div>
            ))}
        </div>
      ),
    },
    {
      title: "Cant. Total",
      key: "cantidad",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-800 text-sm">
            {cantidadTotal(record.tallas)}
          </span>
          <span className="text-[9px] text-gray-400 uppercase font-bold">
            Unidades
          </span>
        </div>
      ),
    },
    {
      title: "Precio Unit.",
      dataIndex: "precio",
      key: "precio",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (precio) => (
        <span className="text-gray-600 font-medium">
          ${precio?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      align: "right",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-bold text-[#1a2e4c] text-base">
          $ {cantidadSubTotal(record.tallas)?.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto animate-fadeIn font-inter">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
            className="border-none shadow-md hover:scale-105 transition-all rounded-xl h-10 w-10 flex items-center justify-center"
          />
          <div>
            <h1 className="text-2xl font-montserrat font-bold text-[#1a2e4c] m-0">
              Detalles del Pedido
            </h1>
            <p className="text-gray-400 text-sm m-0 flex items-center gap-1">
              <FileText size={14} /> ID:{" "}
              <span className="font-mono font-bold text-red-600">#{id}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Tag
            color="green"
            className="m-0 px-4 py-1 rounded-full font-bold text-sm uppercase border-none shadow-sm"
          >
            <span className="text-sm flex items-center gap-1">
              <Calendar size={12} />{" "}
              {pedido
                ? new Date(pedido.fecha).toLocaleDateString()
                : "--/--/--"}
            </span>
          </Tag>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="rounded-2xl shadow-sm border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <User className="text-red-600" size={18} />
              <h3 className="font-montserrat font-bold m-0 text-gray-700">
                Cliente
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold m-0">
                  Nombres
                </p>
                <p className="font-semibold text-[#1a2e4c]">
                  {pedido?.cliente?.nombres} {pedido?.cliente?.apellidos}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold m-0">
                  Documento
                </p>
                <p className="font-semibold text-gray-600 italic">
                  {pedido?.cliente?.documento}
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 mb-4 border-b pb-2 text-gray-500">
              <Store size={18} />
              <h3 className="font-montserrat font-bold m-0">Atendido por</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#1a2e4c] rounded-full flex items-center justify-center text-white font-bold uppercase">
                {pedido?.usuario?.nombres?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-700 m-0 leading-tight">
                  {pedido?.usuario?.nombres} {pedido?.usuario?.apellidos}
                </p>
                <p className="text-[11px] text-gray-400 m-0 uppercase tracking-tighter">
                  Vendedor Bless
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card
            className="rounded-2xl shadow-sm border-gray-100 overflow-hidden"
            title={
              <div className="flex items-center gap-2 py-1">
                <ShoppingCart size={18} className="text-red-600" />
                <span className="font-montserrat font-bold uppercase text-xs tracking-widest text-gray-500">
                  Productos del Pedido
                </span>
              </div>
            }
          >
            <Table
              dataSource={pedido?.productos}
              columns={columns}
              pagination={false}
              rowKey="id"
              size="middle"
            />

            <div className="mt-6 flex justify-end">
              <div className="w-full md:w-64 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1a2e4c]">TOTAL:</span>
                  <span className="text-xl font-montserrat font-black text-red-600">
                    ${pedido?.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DetallesPedido;
