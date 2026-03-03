import { useEffect, useState } from "react";
import { IoMdArrowDropright, IoMdAlert } from "react-icons/io";
import {
  Form,
  Input,
  Table,
  Button,
  Modal,
  Select,
  Tooltip,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoSearchCircle } from "react-icons/io5";
import {
  listarClientes,
  agregarCliente,
  editarCliente,
  eliminarCliente,
} from "../features/clientes.slice";
import { IoIosSave } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import imagen_no_data from "../images/imagen-no-data.jpg";
import { IoMdAddCircle } from "react-icons/io";
import { Eye, Pencil, Trash2, Check } from "lucide-react";
import { Pagination } from "antd";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import { Drawer, Descriptions, Divider, Tag, Card, Statistic } from "antd"; // Asegúrate de importar estos de 'antd'
import { ShoppingBag, User, MapPin, Phone, Mail } from "lucide-react";
import { listarPedidosDeCliente } from "../features/pedidos.slice";
import dayjs from "dayjs";

function ListaClientes() {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.usuario.usuario);
  const clientes = useSelector((state) => state.clientes.clientes);
  //const pedidosCliente = useSelector((state) => state.pedidos.pedidosCliente);

  const [searchText, setSearchText] = useState("");
  const [clienteForm] = Form.useForm();

  const [isClienteModalVisible, setIsClienteModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [pedidosCliente, setPedidosCliente] = useState([]);

  const navigate = useNavigate();

  const lista = Array.isArray(clientes) ? clientes : [];

  console.log("Clientes:", lista);

  const clientesFiltrados = lista.filter((c) => {
    const documento = c.documento.toLowerCase();
    const nombres = c.nombres.toLowerCase();
    const apellidos = c.apellidos.toLowerCase();

    const search = searchText.toLowerCase();

    return (
      nombres.includes(search) ||
      documento.includes(search) ||
      apellidos.includes(search)
    );
  });

  useEffect(() => {
    if (!usuario) dispatch(obtenerUsuarioActual());
    document.title = "Organización Bless | Clientes";
    dispatch(listarClientes())
      .unwrap()
      .then((res) => {
        console.log("Clientes Dispacth:", res);
        toast.success(res.message, {
          toastId: "listar-clientes",
        });
      })
      .catch((err) => {
        console.log("Error al cargar clientes:", err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (editingCliente && isEditModalVisible) {
      clienteForm.setFieldsValue(editingCliente);
    }
  }, [editingCliente, isEditModalVisible, clienteForm]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const datosPaginados = clientesFiltrados.slice(startIndex, endIndex);

  const handleEditClick = (record) => {
    setEditingCliente(record);
    clienteForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleViewClick = (record) => {
    console.log("Click en vista:", record);
    dispatch(listarPedidosDeCliente(record.id))
      .unwrap()
      .then((res) => {
        console.log("Pedidos del cliente:", res);
        setPedidosCliente(res.pedidos);
        toast.success(res.message);
      })
      .catch((err) => {
        console.error("Error al cargar pedidos del cliente:", err);
      });

    setSelectedCliente(record);
    setIsDetailVisible(true);
  };

  const columns = [
    {
      title: "Documento",
      key: "documento",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-bold text-[#1a2e4c] uppercase text-sm font-inter">
          {record.documento}
        </span>
      ),
    },
    {
      title: "Nombres",
      key: "nombres",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-semibold text-gray-700 font-inter">
          {capitalizeFirstLetter(record.nombres)}
        </span>
      ),
    },
    {
      title: "Apellidos",
      key: "apellidos",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-semibold text-gray-700 font-inter">
          {capitalizeFirstLetter(record.apellidos)}
        </span>
      ),
    },
    {
      title: "Dirección",
      key: "direccion",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-semibold text-gray-700 font-inter">
          {capitalizeFirstLetter(record.direccion)}
        </span>
      ),
    },
    {
      title: "Teléfono",
      key: "telefono",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-semibold text-gray-700 font-inter">
          {record.telefono}
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
          <Tooltip title={"Visualizar Información"}>
            <Button
              type="text"
              className="text-emerald-600! hover:text-emerald-700!"
              icon={<Eye size={18} />}
              onClick={() => handleViewClick(record)}
            />
          </Tooltip>
          <Tooltip
            title={
              usuario.rol_activo !== "administrador"
                ? "Acción no permitida"
                : "Editar"
            }
          >
            <Button
              disabled={usuario.rol_activo !== "administrador"}
              type="text"
              className={`text-blue-600! hover:text-blue-700! ${
                usuario.rol_activo !== "administrador"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              icon={<Pencil size={18} />}
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>

          <Tooltip
            title={
              usuario.rol_activo !== "administrador"
                ? "Acción no permitida"
                : "Eliminar"
            }
          >
            <Button
              disabled={usuario.rol_activo !== "administrador"}
              type="text"
              className={`text-red-500! hover:text-red-600! ${
                usuario.rol_activo !== "administrador"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              icon={<Trash2 size={18} />}
              onClick={() => handleEliminarCliente(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleGuardarCliente = (values) => {
    try {
      dispatch(agregarCliente(values))
        .unwrap()
        .then((res) => {
          console.log("Cliente agregado:", res);
          toast.success(res.message);
          clienteForm.resetFields();
          setIsClienteModalVisible(false);
        })
        .catch((err) => {
          clienteForm.resetFields();
          console.error("Error al agregar cliente:", err);
          toast.error(err.message || "Error al agregar cliente");
          return;
        });
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      toast.error(error.message || "Error al agregar cliente");
    }
  };

  const handleActualizarCliente = (values) => {
    console.log("Datos a editar:", values);
    const datos = {
      email: values.email,
      direccion: values.direccion,
      telefono: values.telefono,
    };

    dispatch(editarCliente({ id: editingCliente.id, datos }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Datos actualizados");
        setIsEditModalVisible(false);
        clienteForm.resetFields();
      })
      .catch((err) => toast.error(err.message));
  };

  const handleEliminarCliente = (cliente) => {
    Modal.confirm({
      title: null,
      icon: null,
      width: 450,
      centered: true,
      className: "modal-eliminar-cliente",
      content: (
        <div className="pt-4 pb-2">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <Trash2 size={40} className="text-red-500" />
            </div>
            <h2 className="text-xl font-montserrat font-bold text-gray-800">
              ¿Eliminar Cliente?
            </h2>
            <p className="text-gray-500 font-inter text-sm mt-1">
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                  Documento
                </span>
                <span className="font-semibold text-[#1a2e4c]">
                  {cliente.documento}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                  Nombre Completo
                </span>
                <span className="font-semibold text-gray-700">
                  {capitalizeFirstLetter(cliente.nombres)}{" "}
                  {capitalizeFirstLetter(cliente.apellidos)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-xl border border-amber-100">
            <IoMdAlert className="text-amber-500 shrink-0" size={20} />
            <p className="text-[12px] text-amber-800 m-0 font-inter leading-tight">
              Al eliminar este cliente, se perderá permanentemente su historial
              y datos de contacto en el sistema.
            </p>
          </div>
        </div>
      ),
      okText: "Sí, eliminar ahora",
      okType: "danger",
      cancelText: "No, cancelar",
      okButtonProps: {
        className:
          "bg-red-600 hover:bg-red-700 border-none h-10 px-6 rounded-lg font-bold text-sm transition-all shadow-md shadow-red-200",
      },
      cancelButtonProps: {
        className:
          "h-10 px-6 rounded-lg font-semibold hover:text-gray-700 border-gray-200",
      },
      onOk() {
        console.log("Eliminando cliente:", cliente.id);

        return dispatch(eliminarCliente(cliente.id))
          .unwrap()
          .then((res) => {
            toast.success(res.message || "Cliente eliminado con éxito");
            dispatch(listarClientes());
          })
          .catch((error) => {
            toast.error(error.message || "Error al eliminar");
          });
      },
    });
  };

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

  return (
    <div className="p-2 w-full animate-fadeIn">
      <div className="flex items-center mb-3">
        <IoMdArrowDropright className="text-red-600" size={35} />
        <h1 className="text-xl font-montserrat font-bold -ml-1!">
          Lista de Clientes
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
              placeholder="Buscar documento o nombre..."
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
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<IoMdAddCircle size={18} />}
            onClick={() => {
              clienteForm.resetFields();
              setIsClienteModalVisible(true);
            }}
            className="bg-[#1a2e4c] hover:scale-[1.02] active:scale-95 border-none h-10 px-5 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all duration-300 shadow-md shadow-blue-900/20 uppercase tracking-wider font-inter"
          >
            Nuevo Cliente
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
          Total: <strong>{clientesFiltrados.length}</strong> referencias
          encontradas
        </span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={clientesFiltrados.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
      <Modal
        title={
          <div className="flex items-center gap-2 border-b pb-3">
            <IoMdAddCircle className="text-[#1a2e4c]" size={22} />
            <span className="font-montserrat font-bold text-base">
              Registrar Nuevo Cliente
            </span>
          </div>
        }
        open={isClienteModalVisible}
        onCancel={() => {
          setIsClienteModalVisible(false);
          clienteForm.resetFields();
        }}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={clienteForm}
          layout="vertical"
          onFinish={handleGuardarCliente}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-5">
            <Form.Item
              name="documento"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Documento / NIT<span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                { required: true, message: "Ingrese el documento" },
                { pattern: /^[0-9]+$/, message: "Solo se permiten números" },
                { min: 5, message: "Mínimo 5 dígitos" },
              ]}
            >
              <Input
                placeholder="Ej: 1090..."
                className="rounded-lg h-8 -top-2!"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Correo Electrónico <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                { required: true, message: "Ingrese el correo electrónico" },
                { type: "email", message: "Ingrese un correo válido" },
              ]}
            >
              <Input
                placeholder="Ej: juan.perez@gmail.com"
                className="rounded-lg h-8 -top-2!"
              />
            </Form.Item>

            <Form.Item
              name="nombres"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Nombres <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                { required: true, message: "Ingrese los nombres" },
                {
                  pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: "Solo se permiten letras",
                },
              ]}
            >
              <Input placeholder="Nombres" className="rounded-lg h-8 -top-2!" />
            </Form.Item>

            <Form.Item
              name="apellidos"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Apellidos <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                { required: true, message: "Ingrese los apellidos" },
                {
                  pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: "Solo se permiten letras",
                },
              ]}
            >
              <Input
                placeholder="Apellidos"
                className="rounded-lg h-8 -top-2!"
              />
            </Form.Item>

            <Form.Item
              name="telefono"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Teléfono <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                { required: true, message: "Ingrese un teléfono" },
                { pattern: /^[0-9]+$/, message: "Solo números" },
                { len: 10, message: "Debe tener 10 dígitos" },
              ]}
            >
              <Input
                placeholder="Ej: 310..."
                className="rounded-lg h-8 -top-2!"
              />
            </Form.Item>

            <Form.Item
              name="direccion"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Dirección <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                { required: true, message: "Ingrese la dirección" },
                {
                  min: 5,
                  message: "Dirección demasiado corta",
                },
              ]}
            >
              <Input
                placeholder="Ej: Calle 10 #2-3"
                className="rounded-lg h-8 -top-2!"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setIsClienteModalVisible(false)}
              className="rounded-lg border-gray-300 font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<IoIosSave size={18} />}
              className="bg-[#1a2e4c] border-none rounded-lg px-6 font-bold flex items-center gap-2"
            >
              Guardar Cliente
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={
          <div className="flex items-center gap-2 border-b pb-3">
            <Pencil className="text-[#1a2e4c]" size={20} />
            <span className="font-montserrat font-bold text-base">
              Editar Datos de Contacto
            </span>
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          clienteForm.resetFields();
        }}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={clienteForm}
          layout="vertical"
          onFinish={handleActualizarCliente}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item
              name="documento"
              label={
                <span className="font-semibold text-gray-400 text-[13px] font-inter">
                  Documento
                </span>
              }
            >
              <Input
                className="rounded-lg h-8 bg-gray-50 text-gray-400 -mt-2!"
                disabled
              />
            </Form.Item>

            <Form.Item
              name="nombres"
              label={
                <span className="font-semibold text-gray-400 text-[13px]">
                  Nombres
                </span>
              }
            >
              <Input
                className="rounded-lg h-8 bg-gray-50 text-gray-400 -mt-2!"
                disabled
              />
            </Form.Item>

            <Form.Item
              name="apellidos"
              label={
                <span className="font-semibold text-gray-400 text-[13px]">
                  Apellidos
                </span>
              }
            >
              <Input
                className="rounded-lg h-8 bg-gray-50 text-gray-400 -mt-2!"
                disabled
              />
            </Form.Item>

            <hr className="md:col-span-2 my-2 opacity-50 -mt-2" />

            <Form.Item
              name="email"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Correo Electrónico <span className="text-red-500">*</span>
                </span>
              }
              rules={[
                { required: true, message: "El correo es obligatorio" },
                { type: "email", message: "Ingrese un correo válido" },
              ]}
            >
              <Input
                placeholder="correo@ejemplo.com"
                className="rounded-lg h-8"
              />
            </Form.Item>

            <Form.Item
              name="telefono"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Teléfono <span className="text-red-500">*</span>
                </span>
              }
              rules={[
                { required: true, message: "El teléfono es obligatorio" },
                { pattern: /^[0-9]+$/, message: "Solo números" },
                { len: 10, message: "Debe tener 10 dígitos" },
              ]}
            >
              <Input placeholder="Ej: 310..." className="rounded-lg h-8" />
            </Form.Item>

            <Form.Item
              name="direccion"
              label={
                <span className="font-semibold text-[13px] font-inter">
                  Dirección <span className="text-red-500">*</span>
                </span>
              }
              className="md:col-span-2"
              rules={[
                { required: true, message: "La dirección es obligatoria" },
                { min: 5, message: "Dirección muy corta" },
              ]}
            >
              <Input
                placeholder="Ej: Calle 10 #2-3"
                className="rounded-lg h-8"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => setIsEditModalVisible(false)}
              className="rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<Check size={18} />}
              className="bg-[#1a2e4c] border-none rounded-lg px-6 font-bold"
            >
              Actualizar Datos
            </Button>
          </div>
        </Form>
      </Modal>
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <User className="text-red-600" size={20} />
            <span className="font-montserrat font-bold text-red-600">
              Perfil del Cliente
            </span>
          </div>
        }
        placement="right"
        width={450}
        onClose={() => setIsDetailVisible(false)}
        open={isDetailVisible}
      >
        {selectedCliente && (
          <div className="flex flex-col gap-6">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-inter">
                <User size={16} /> Información Personal
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 m-0 font-montserrat">
                    Nombre Completo
                  </p>
                  <p className="font-bold text-[#1a2e4c] text-base font-inter">
                    {`${selectedCliente.nombres} ${selectedCliente.apellidos}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 m-0 font-montserrat">
                    Documento
                  </p>
                  <p className="font-bold text-gray-700 font-inter">
                    {selectedCliente.documento}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Phone size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 m-0 uppercase font-montserrat">
                      Teléfono
                    </p>
                    <p className="text-sm font-semibold font-inter -mt-1">
                      {selectedCliente.telefono}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Mail size={14} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 m-0 uppercase font-montserrat">
                      Correo
                    </p>
                    <p className="text-sm font-semibold font-inter -mt-1">
                      {selectedCliente.email}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Divider className="my-2 bg-red-500" />

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 m-0 font-inter">
                  <ShoppingBag size={16} /> Historial de Pedidos
                </h3>
                <Tag
                  color="blue"
                  className="rounded-full px-3 font-bold font-montserrat"
                >
                  {pedidosCliente?.length || 0} Pedidos
                </Tag>
              </div>

              <Table
                dataSource={pedidosCliente || []}
                pagination={{ pageSize: 5 }}
                size="small"
                className="border border-gray-100 rounded-xl overflow-hidden"
                columns={[
                  {
                    title: "ID Pedido",
                    dataIndex: "id_pedido",
                    key: "id_pedido",
                    onHeaderCell: () => ({
                      className: "uppercase tracking-wider font-inter",
                    }),
                    render: (_, record) => (
                      <span className="font-inter font-bold text-blue-600">
                        #{record.id}
                      </span>
                    ),
                  },
                  {
                    title: "Fecha",
                    dataIndex: "fecha",
                    key: "fecha",
                    onHeaderCell: () => ({
                      className: "uppercase tracking-wider font-inter",
                    }),
                    render: (_, record) =>
                      new Date(record.fecha).toLocaleDateString(),
                  },
                  {
                    title: "Total",
                    dataIndex: "total",
                    key: "total",
                    align: "right",
                    onHeaderCell: () => ({
                      className: "uppercase tracking-wider font-inter",
                    }),
                    render: (_, record) => (
                      <span className="font-bold">
                        ${record.total.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    title: "Acción",
                    key: "accion",
                    align: "center",
                    width: 80,
                    onHeaderCell: () => ({
                      className:
                        "uppercase tracking-wider font-inter text-[11px]",
                    }),
                    render: (_, record) => (
                      <Tooltip title="Ver detalle del pedido">
                        <Button
                          type="text"
                          size="small"
                          className="text-emerald-600! hover:bg-emerald-50! flex items-center justify-center mx-auto"
                          icon={<Eye size={16} />}
                          onClick={() => {
                            console.log("Navegando al pedido:", record.id);
                            navigate(`pedidos/${record.id}`);
                          }}
                        />
                      </Tooltip>
                    ),
                  },
                ]}
                locale={{ emptyText: "Este cliente aún no registra pedidos." }}
              />
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default ListaClientes;
