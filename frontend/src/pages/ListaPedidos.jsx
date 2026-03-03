import { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import {
  Form,
  Input,
  Table,
  Button,
  Modal,
  Select,
  Tooltip,
  Space,
  DatePicker,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoSearchCircle } from "react-icons/io5";
import { listarClientes } from "../features/clientes.slice";
import { IoIosSave } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import imagen_no_data from "../images/imagen-no-data.jpg";
import { IoMdAddCircle } from "react-icons/io";
import { Eye, Trash2, Check } from "lucide-react";
import { Pagination } from "antd";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import { Statistic } from "antd";
import { ShoppingBag, User, Package } from "lucide-react";
import dayjs from "dayjs";
import { listarPedidos, agregarPedido } from "../features/pedidos.slice";
import { listarProductosConTallas } from "../features/productos.slice";

function ListaPedidos() {
  const dispatch = useDispatch();
  const clientes = useSelector((state) => state.clientes.clientes);
  const pedidos = useSelector((state) => state.pedidos.pedidos);
  const productos = useSelector((state) => state.productos.productos);
  const usuario = useSelector((state) => state.usuario.usuario);

  const [searchText, setSearchText] = useState("");
  const [clienteForm] = Form.useForm();

  const [isClienteModalVisible, setIsClienteModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [addPedidoModalVisible, setAddPedidoModalVisible] = useState(false);
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState(null);

  const navigate = useNavigate();

  const lista = Array.isArray(pedidos) ? pedidos : [];

  console.log("Pedidos:", pedidos);

  const pedidosFiltrados = lista.filter((c) => {
    const nombres = c.Cliente.nombres.toLowerCase();
    const apellidos = c.Cliente.apellidos.toLowerCase();
    const search = searchText.toLowerCase();

    const coincideNombre =
      nombres.includes(search) || apellidos.includes(search);

    let coincideFecha = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const fechaPedido = dayjs(c.fecha);
      const inicio = dateRange[0].startOf("day");
      const fin = dateRange[1].endOf("day");

      coincideFecha = fechaPedido.isAfter(inicio) && fechaPedido.isBefore(fin);
    }

    return coincideNombre && coincideFecha;
  });

  useEffect(() => {
    document.title = "Organización Bless | Pedidos";
    dispatch(listarClientes());
    dispatch(listarProductosConTallas());
    dispatch(listarPedidos())
      .unwrap()
      .then((res) => {
        console.log("Pedidos Dispacth:", res);
        toast.success(res.message, {
          toastId: "listar-pedidos",
        });
      })
      .catch((err) => {
        console.log("Error al cargar pedidos:", err);
      });
  }, [dispatch]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const datosPaginados = pedidosFiltrados.slice(startIndex, endIndex);

  console.log(productos);

  const columns = [
    {
      title: "Id Pedido",
      key: "id_pedido",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-bold text-[#1a2e4c] uppercase text-sm font-inter">
          {record.id}
        </span>
      ),
    },
    {
      title: "Cliente",
      key: "cliente",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-semibold text-gray-700 font-inter">
          {`${capitalizeFirstLetter(record.Cliente.nombres)} ${capitalizeFirstLetter(record.Cliente.apellidos)}`}
        </span>
      ),
    },
    {
      title: "Fecha de Registro",
      key: "fecha_registro",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-semibold text-gray-700 font-inter">
          {dayjs(record.fecha).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Total",
      key: "total",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-semibold text-gray-700 font-inter">
          {record.total?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Visualizar Información">
            <Button
              type="text"
              className="text-emerald-600! hover:text-emerald-700!"
              icon={<Eye size={18} />}
              onClick={() => navigate(`${record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columnsPedido = [
    {
      title: "Producto",
      key: "producto",
      width: "30%",
      render: (_, record) => (
        <Select
          showSearch
          placeholder="Seleccione prenda..."
          className="w-full font-semibold"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          onChange={(val) => handleSeleccionarProducto(val, record.key)}
          options={productos.map((p) => ({ value: p.id, label: p.nombre }))}
        />
      ),
    },
    {
      title: "Valor Unit.",
      key: "precio_unitario",
      align: "right",
      width: "12%",
      render: (_, record) => (
        <span className="font-mono font-medium text-gray-600">
          {record.precio > 0 ? `$${record.precio.toLocaleString()}` : "-"}
        </span>
      ),
    },
    {
      title: "Talla",
      key: "talla_select",
      width: "20%",
      render: (_, record) => {
        const productoData = productos.find((p) => p.id === record.id_producto);
        const tallasYaElegidas = productosSeleccionados
          .filter(
            (p) => p.id_producto === record.id_producto && p.key !== record.key,
          )
          .map((p) => p.tallaSeleccionada);

        const opcionesDisponibles =
          productoData?.ProductoTallas?.map((t) => ({
            value: t.Talla.id,
            label: `${t.Talla.nombre} (Stock: ${t.stock})`,
            stock: t.stock,
          })).filter((opcion) => !tallasYaElegidas.includes(opcion.value)) ||
          [];

        return (
          <Select
            placeholder="Talla"
            className="w-full"
            disabled={!record.id_producto}
            value={record.tallaSeleccionada}
            onChange={(val, option) =>
              handleCambiarTallaFila(val, record.key, option.stock)
            }
            options={opcionesDisponibles}
          />
        );
      },
    },
    {
      title: "Cantidad",
      key: "cantidad_input",
      width: "15%",
      render: (_, record) => (
        <div className="flex flex-col">
          <Input
            type="number"
            min={1}
            max={record.stockMax}
            disabled={!record.tallaSeleccionada}
            placeholder="0"
            value={record.cantidad || ""}
            onChange={(e) =>
              handleCambiarCantidadFila(e.target.value, record.key)
            }
            className={`font-bold text-center ${
              record.cantidad > record.stockMax
                ? "border-red-500 text-red-600"
                : "text-blue-700"
            }`}
          />
          {record.tallaSeleccionada && (
            <span className="text-[10px] text-gray-400 text-center mt-1">
              Máx: {record.stockMax}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Subtotal",
      align: "right",
      width: "15%",
      render: (_, record) => {
        const subtotal = (record.cantidad || 0) * record.precio;
        return (
          <span
            className={`font-bold ${subtotal > 0 ? "text-emerald-600" : "text-gray-300"}`}
          >
            ${subtotal.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "",
      key: "opciones",
      align: "center",
      width: "50px",
      render: (_, record) => (
        <Button
          type="text"
          danger
          shape="circle"
          icon={<Trash2 size={16} />}
          onClick={() => eliminarFila(record.key)}
        />
      ),
    },
  ];

  const EmptyTable = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <img
        src={imagen_no_data}
        alt="No hay datos"
        className="w-40 opacity-80 mb-4"
      />
      <span className="font-inter text-gray-500 text-sm">
        No hay datos para mostrar
      </span>
    </div>
  );

  const buscarCliente = (documento) => {
    if (!documento) return;
    setBuscandoCliente(true);
    console.log(clientes);
    const cliente = clientes.find((c) => c.documento === documento);

    setTimeout(() => {
      if (cliente) {
        setClienteEncontrado(cliente);
        toast.success("Cliente vinculado al pedido");
      } else {
        toast.info("El cliente no existe. Por favor, registre el cliente");
        setClienteEncontrado(null);
      }
      setBuscandoCliente(false);
    }, 800);
  };

  const agregarFilaProducto = () => {
    const nuevaFila = {
      key: Date.now(),
      id_producto: null,
      nombre: "",
      precio: 0,
      tallaSeleccionada: null,
      cantidad: 0,
    };
    setProductosSeleccionados([...productosSeleccionados, nuevaFila]);
  };

  const handleSeleccionarProducto = (id, filaKey) => {
    const productoBase = productos.find((p) => p.id === id);
    if (!productoBase) return;

    const nuevosProductos = productosSeleccionados.map((fila) => {
      if (fila.key === filaKey) {
        return {
          ...fila,
          id_producto: productoBase.id,
          nombre: productoBase.nombre,
          precio: productoBase.precio,
          tallaSeleccionada: null,
          cantidad: 0,
        };
      }
      return fila;
    });
    setProductosSeleccionados(nuevosProductos);
  };

  const handleCambiarTallaFila = (talla, filaKey, stockDisponible) => {
    const nuevos = productosSeleccionados.map((f) =>
      f.key === filaKey
        ? {
            ...f,
            tallaSeleccionada: talla,
            stockMax: stockDisponible, // Guardamos el límite
            cantidad:
              f.cantidad > stockDisponible ? stockDisponible : f.cantidad, // Ajustamos si ya había una cantidad mayor
          }
        : f,
    );
    setProductosSeleccionados(nuevos);
  };

  const handleCambiarCantidadFila = (valor, filaKey) => {
    const numValor = parseInt(valor) || 0;

    const nuevos = productosSeleccionados.map((f) => {
      if (f.key === filaKey) {
        if (numValor > f.stockMax) {
          toast.warning(`Solo hay ${f.stockMax} unidades disponibles`, {
            toastId: "stock-limit",
          });
          return { ...f, cantidad: f.stockMax };
        }
        return { ...f, cantidad: numValor };
      }
      return f;
    });
    setProductosSeleccionados(nuevos);
  };

  const totalGeneral = productosSeleccionados.reduce((acc, prod) => {
    return acc + (prod.cantidad || 0) * prod.precio;
  }, 0);

  const eliminarFila = (filaKey) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((f) => f.key !== filaKey),
    );
    toast.info("Producto removido del pedido");
  };

  const handleGuardarPedido = async () => {
    const productosValidos = productosSeleccionados.filter(
      (p) => p.id_producto && p.tallaSeleccionada && p.cantidad > 0,
    );

    if (!clienteEncontrado) {
      return toast.error("Debe asociar un cliente al pedido");
    }

    if (productosValidos.length === 0) {
      return toast.error(
        "Debe agregar al menos un producto completo (con talla y cantidad)",
      );
    }

    const dataPedido = {
      id_usuario: usuario.id,
      id_cliente: clienteEncontrado.id,
      total: totalGeneral,
      detalles: productosValidos.map((p) => ({
        id_producto: p.id_producto,
        talla: p.tallaSeleccionada,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        subtotal: p.cantidad * p.precio,
      })),
    };

    dispatch(agregarPedido(dataPedido))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        console.error("Error al agregar pedido:", err);
        toast.error(err.message || "Error al agregar pedido");
      });

    console.log("Enviando Pedido:", dataPedido);

    try {
      setAddPedidoModalVisible(false);
      setProductosSeleccionados([]);
      setClienteEncontrado(null);
    } catch (error) {
      toast.error("Error al guardar el pedido: " + error);
    }
  };

  return (
    <div className="p-2 w-full animate-fadeIn">
      <div className="flex items-center mb-3">
        <IoMdArrowDropright className="text-red-600" size={35} />
        <h1 className="text-xl font-montserrat font-bold -ml-1!">
          Lista de Pedidos
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-4 mb-6 bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100">
            <Select
              variant="borderless"
              value={pageSize}
              onChange={(v) => setPageSize(v)}
              className="w-15 text-xs font-semibold"
              options={[
                { value: 6, label: "6" },
                { value: 12, label: "12" },
                { value: 24, label: "24" },
              ]}
            />
          </div>

          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder="Buscar nombre de cliente..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={
                <IoSearchCircle
                  size={22}
                  className="text-[#1a2e4c] opacity-70"
                />
              }
              className="rounded-xl h-10 border-gray-100 bg-gray-50/50 hover:bg-white focus:bg-white transition-all duration-300 shadow-inner-sm"
              allowClear
            />
          </div>

          <div className="min-w-[280px]">
            <RangePicker
              placeholder={["Inicio", "Fin"]}
              className="rounded-xl h-10 border-gray-100 bg-gray-50/50 hover:bg-white transition-all w-full"
              onChange={(values) => {
                setDateRange(values);
                setCurrentPage(1);
              }}
              presets={[
                { label: "Hoy", value: [dayjs(), dayjs()] },
                {
                  label: "Este Mes",
                  value: [dayjs().startOf("month"), dayjs().endOf("month")],
                },
                {
                  label: "Este Año",
                  value: [dayjs().startOf("year"), dayjs().endOf("year")],
                },
                {
                  label: "Últimos 90 días",
                  value: [dayjs().subtract(90, "d"), dayjs()],
                },
              ]}
              format="DD/MM/YYYY"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<IoMdAddCircle size={18} />}
            onClick={() => {
              clienteForm.resetFields();
              setIsClienteModalVisible(true);
              setAddPedidoModalVisible(true);
            }}
            className="bg-[#1a2e4c] hover:scale-[1.02] active:scale-95 border-none h-10 px-5 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all duration-300 shadow-md shadow-blue-900/20 uppercase tracking-wider font-inter"
          >
            Nuevo Pedido
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ConfigProvider locale={esES}>
          <Table
            columns={columns}
            dataSource={datosPaginados}
            rowKey="id_producto"
            pagination={false}
            locale={{
              emptyText: <EmptyTable />,
            }}
          />
        </ConfigProvider>
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="text-gray-500 text-sm italic">
          Total: <strong>{pedidosFiltrados.length}</strong> referencias
          encontradas
        </span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={pedidosFiltrados.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
      <Modal
        title={
          <div className="flex items-center gap-2 border-b pb-3">
            <ShoppingBag className="text-red-600" size={22} />
            <span className="font-montserrat font-bold text-lg text-[#1a2e4c]">
              Generar Nuevo Pedido
            </span>
          </div>
        }
        open={addPedidoModalVisible}
        onCancel={() => setAddPedidoModalVisible(false)}
        width={1000}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setAddPedidoModalVisible(false);
              setProductosSeleccionados([]); // Limpiar al cerrar
              setClienteEncontrado(null);
            }}
            className="rounded-lg"
          >
            Cancelar
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<IoIosSave />}
            className="bg-emerald-600 hover:bg-emerald-700 border-none rounded-lg px-8"
            // VALIDACIÓN DINÁMICA:
            disabled={
              !clienteEncontrado ||
              productosSeleccionados.length === 0 ||
              !productosSeleccionados.some(
                (p) => p.id_producto && p.tallaSeleccionada && p.cantidad > 0,
              )
            }
            onClick={handleGuardarPedido}
          >
            Guardar Pedido Final
          </Button>,
        ]}
        centered
      >
        <div className="flex flex-col gap-6 py-4">
          <section className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-inter">
              <User size={16} /> 1. Identificación del Cliente
            </h3>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input.Search
                  placeholder="Ingrese documento del cliente..."
                  enterButton="Buscar"
                  size="large"
                  loading={buscandoCliente}
                  onSearch={buscarCliente}
                  className="custom-search"
                />
              </div>
              {clienteEncontrado && (
                <div className="flex-1 bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-3 animate-fadeIn -mt-2">
                  <div className="bg-emerald-50 p-2 rounded-full">
                    <Check className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold m-0 font-inter">
                      Cliente Seleccionado
                    </p>
                    <p className="font-bold text-[#1a2e4c] m-0 font-montserrat">
                      {clienteEncontrado.nombres} {clienteEncontrado.apellidos}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest m-0 flex items-center gap-2 font-inter">
                <Package size={16} /> 2. Productos y Cantidades
              </h3>
              <Button
                type="dashed"
                icon={<IoMdAddCircle />}
                onClick={agregarFilaProducto}
                className="text-red-600 border-red-200 hover:text-red-700 hover:border-red-600 font-bold"
              >
                Añadir Producto
              </Button>
            </div>

            <Table
              dataSource={productosSeleccionados}
              columns={columnsPedido}
              pagination={false}
              rowKey="key"
              locale={{ emptyText: "No hay productos en este pedido" }}
              className="mt-2"
            />
          </section>

          <section className="flex justify-end mt-4">
            <div className="bg-[#1a2e4c] text-white p-6 rounded-3xl flex items-center gap-8 shadow-xl shadow-blue-900/20">
              <div className="flex flex-col">
                <span className="text-blue-200 text-xs uppercase font-bold tracking-widest">
                  Total del Pedido
                </span>
                <span className="text-3xl font-montserrat font-black leading-tight">
                  ${totalGeneral.toLocaleString()}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-blue-400/30"></div>
              <Statistic
                title={
                  <span className="text-blue-200 text-[10px] uppercase">
                    Items
                  </span>
                }
                value={productosSeleccionados.length}
                valueStyle={{
                  color: "white",
                  fontWeight: "900",
                  fontSize: "20px",
                }}
              />
            </div>
          </section>
        </div>
      </Modal>
    </div>
  );
}

export default ListaPedidos;
