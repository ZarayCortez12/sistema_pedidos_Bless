import React, { useEffect, useState } from "react";
import { IoMdArrowDropright, IoMdAlert } from "react-icons/io";
import {
  Form,
  Input,
  Table,
  Button,
  Modal,
  Select,
  Tooltip,
  Tag,
  Space,
  Popconfirm,
  Drawer,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoSearchCircle } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import {
  listarProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  ingresarStockAProducto,
  agregarTallaAProducto,
} from "../features/productos.slice";
import { CloseOutlined } from "@ant-design/icons";
import { BiSolidCategory } from "react-icons/bi";
import { IoIosSave } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import imagen_no_data from "../images/imagen-no-data.jpg";
import { IoMdAddCircle } from "react-icons/io";
import {
  Eye,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
  Check,
  PackagePlus,
} from "lucide-react";
import { Pagination } from "antd";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import { listarTallas, agregarTalla } from "../features/talla.slice";

function ListaProductos() {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.productos.productos);
  const tallas = useSelector((state) => state.tallas.tallas);

  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [stockForm] = Form.useForm();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);
  const [nuevaTallaNombre, setNuevaTallaNombre] = useState("");
  const [mostrarInputTalla, setMostrarInputTalla] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const lista = Array.isArray(productos) ? productos : [];

  console.log("Productos:", lista);
  console.log("Tallas:", tallas);

  const productosFiltrados = lista.filter((c) => {
    const nombre = c.nombre.toLowerCase();
    const codigo = c.codigo.toLowerCase();

    const search = searchText.toLowerCase();

    return nombre.includes(search) || codigo.includes(search);
  });

  useEffect(() => {
    document.title = "Organización Bless | Productos";

    dispatch(listarProductos())
      .unwrap()
      .then((res) => {
        console.log("Productos Dispacth:", res);
        toast.success(res.message, {
          toastId: "listar-productos",
        });
      })
      .catch((err) => {
        console.log("Error al cargar productos:", err);
      });
    dispatch(listarTallas());
  }, [dispatch]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const datosPaginados = productosFiltrados.slice(startIndex, endIndex);

  const handleEditClick = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      stock_tallas: record.ProductoTallas?.reduce((acc, curr) => {
        acc[curr.id_talla] = curr.stock;
        return acc;
      }, {}),
    });
    setOpenDrawer(true);
  };

  const handleStockClick = (record) => {
    console.log("Click en stock:", record);
    setSelectedProductForStock(record);
    stockForm.resetFields();
    setIsStockModalVisible(true);
  };

  const onFinishStock = (values) => {
    try {
      if (!selectedProductForStock) return;

      const cambios = values.actualizar;

      if (!cambios || Object.keys(cambios).length === 0) {
        return toast.info("No has ingresado ninguna cantidad para actualizar.");
      }

      const actualizar = Object.entries(cambios)
        .filter(
          ([_, cantidad]) =>
            cantidad !== undefined && cantidad !== null && cantidad > 0,
        )
        .map(([tallaId, cantidad]) => {
          const relacionTalla = selectedProductForStock.ProductoTallas.find(
            (pt) =>
              (pt.Talla?.id || pt.id_talla).toString() === tallaId.toString(),
          );

          return {
            id_producto_talla: relacionTalla?.id,
            nuevo_stock: cantidad,
            id_talla: parseInt(tallaId),
          };
        });

      if (actualizar.length === 0) {
        return toast.warning("Ingresa una cantidad válida mayor a cero.");
      }

      const dataParaEnviar = {
        id_producto: selectedProductForStock.id,
        actualizar: actualizar,
      };

      console.log("Datos listos para enviar al backend:", dataParaEnviar);

      dispatch(ingresarStockAProducto(dataParaEnviar))
        .unwrap()
        .then((res) => {
          toast.success(res.message || "Stock actualizado correctamente");
          setIsStockModalVisible(false);
          stockForm.resetFields();
          dispatch(listarProductos());
        })
        .catch((err) => toast.error(err.message));
    } catch (error) {
      console.error("Error en onFinishStock:", error);
    }
  };

  const columns = [
    {
      title: (
        <div className="text-center w-full uppercase tracking-wider font-inter">
          Producto
        </div>
      ),
      key: "producto",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#1a2e4c] uppercase text-sm font-inter">
            {record.nombre}
          </span>
          <span className="text-[12px] text-gray-400 font-inter">
            {record.codigo}
          </span>
        </div>
      ),
    },
    {
      title: "Precio",
      key: "precio",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      render: (_, record) => (
        <span className="font-semibold text-gray-700 font-inter">
          ${Number(record.precio).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Disponibilidad por Talla (Talla: Cantidad)",
      align: "center",
      onHeaderCell: () => ({
        className: "uppercase tracking-wider font-inter",
      }),
      key: "stock_talla",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          {record.ProductoTallas?.map((item, index) => (
            <div
              key={index}
              className="flex items-center border border-gray-200 rounded-md overflow-hidden shadow-sm"
            >
              <div className="bg-slate-100 px-2 py-1 text-[11px] font-bold border-r border-gray-200">
                {item.Talla?.nombre || item.talla}
              </div>
              <div
                className={`px-2 py-1 text-[11px] font-bold ${item.stock < 5 ? "text-red-500 bg-red-50" : "text-emerald-600 bg-emerald-50"}`}
              >
                {item.stock}
              </div>
            </div>
          ))}
        </div>
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
          <Tooltip title="Añadir Stock">
            <Button
              type="text"
              className="text-emerald-600! hover:text-emerald-700!"
              icon={<PackagePlus size={18} />}
              onClick={() => handleStockClick(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={
                <Pencil
                  size={18}
                  className="text-blue-600! hover:text-blue-700!"
                />
              }
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Popconfirm
            title="¿Eliminar?"
            onConfirm={() => handleEliminarProducto(record)}
          >
            <Button
              type="text"
              icon={
                <Trash2
                  size={18}
                  className="text-red-500! hover:text-red-600!"
                />
              }
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAgregarTalla = (nombreTalla) => {
    try {
      if (!nombreTalla.trim()) {
        toast.warning("El nombre de la talla no puede estar vacío");
        return;
      }

      const existe = tallas.some(
        (t) => t.nombre.toUpperCase() === nombreTalla.toUpperCase(),
      );
      if (existe) {
        toast.error("Esta talla ya existe");
        return;
      }

      dispatch(agregarTalla({ nombre: nombreTalla }))
        .unwrap()
        .then((res) => {
          toast.success("Talla agregada correctamente");
          setNuevaTallaNombre("");
          setMostrarInputTalla(false);
        })
        .catch((err) => {
          console.error("Error al agregar talla:", err);
          toast.error(err.message || "Error al agregar talla");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAgregarProducto = (values) => {
    try {
      const { stock_tallas, ...restOfValues } = values;
      const stock_talla_formateado = Object.keys(stock_tallas || {})
        .filter(
          (idTalla) =>
            stock_tallas[idTalla] !== undefined && stock_tallas[idTalla] !== "",
        )
        .map((idTalla) => ({
          id_talla: parseInt(idTalla),
          stock: parseInt(stock_tallas[idTalla]),
        }));

      if (stock_talla_formateado.length === 0) {
        return toast.warning("Debes ingresar stock para al menos una talla");
      }

      const dataParaEnviar = {
        ...restOfValues,
        stock_talla: stock_talla_formateado,
      };

      console.log("Datos listos para el backend:", dataParaEnviar);

      dispatch(agregarProducto(dataParaEnviar))
        .unwrap()
        .then((res) => {
          console.log("Producto agregado:", res);
          toast.success(res.message);
          setOpenDrawer(false);
          form.resetFields();
        })
        .catch((err) => {
          console.error("Error al agregar producto:", err);
          toast.error(err.message || "Error al agregar producto");
        });
    } catch (error) {
      console.error("Error al procesar datos:", error);
    }
  };

  const handleEditarProducto = (values) => {
    try {
      console.log("Datos a editar:", values);
      dispatch(
        editarProducto({
          id: editingProduct.id,
          precio: values.precio,
        }),
      )
        .unwrap()
        .then((res) => {
          console.log("Producto editado:", res);
          toast.success(res.message);
          setOpenDrawer(false);
          form.resetFields();
        })
        .catch((err) => {
          console.error("Error al editar producto:", err);
          toast.error(err.message || "Error al editar producto");
        });
    } catch (error) {
      console.error("Error al procesar datos:", error);
    }
  };

  const handleEliminarProducto = (producto) => {
    console.log("Eliminando producto:", producto);
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de eliminar este producto?
        </div>
      ),
      content: (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <BiSolidCategory
              style={{
                fontSize: "20px",
                color: "#e10318",
                marginRight: "15px",
              }}
            />
            <div style={{ fontFamily: "Inter", marginLeft: "-10px" }}>
              <strong>Nombre: </strong>
              {capitalizeFirstLetter(producto.nombre)}
            </div>
          </div>
          <span
            style={{
              display: "flex",
              background: "hsl(354, 65%, 85%)",
              padding: "10px",
              borderRadius: "10px",
              marginLeft: "-30px",
              fontFamily: "Inter",
              justifyContent: "center",
              alignItems: "center",
              height: "60px",
            }}
          >
            <IoMdAlert
              style={{
                fontSize: "65px",
                color: "#e10318",
                marginRight: "8px",
              }}
            />
            <p style={{ fontSize: "12px", color: "#333", margin: 0 }}>
              Recuerda que el acción de eliminar es permanente y no se podrá
              recuperar la información del producto.
            </p>
          </span>
        </div>
      ),
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        dispatch(eliminarProducto(producto.id))
          .unwrap()
          .then((res) => {
            toast.success(res.message);
            dispatch(listarProductos());
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
  };

  const handleAgregarTallaAProducto = (datos) => {
    try {
      console.log("Datos a agregar:", datos);
      dispatch(agregarTallaAProducto(datos))
        .unwrap()
        .then((res) => {
          console.log("Talla agregada:", res);
          toast.success(res.message);
          stockForm.resetFields();
          setIsStockModalVisible(false);
        })
        .catch((err) => {
          console.error("Error al agregar talla:", err);
          toast.error(err.message || "Error al agregar talla");
        });
    } catch (error) {
      console.error("Error al procesar datos:", error);
    }
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
          Lista de Productos
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
              placeholder="Buscar referencia o nombre..."
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
              setEditingProduct(null);
              form.resetFields();
              setOpenDrawer(true);
            }}
            className="bg-[#1a2e4c] hover:scale-[1.02] active:scale-95 border-none h-10 px-5 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all duration-300 shadow-md shadow-blue-900/20 uppercase tracking-wider font-inter"
          >
            Nuevo Producto
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
          Total: <strong>{productosFiltrados.length}</strong> referencias
          encontradas
        </span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={productosFiltrados.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      <Drawer
        title={
          <span className="text-[#1a2e4c] font-bold font-poppins">
            {editingProduct ? "EDITAR PRODUCTO" : "CREAR NUEVO PRODUCTO"}
          </span>
        }
        placement="right"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        width={450}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(v) => {
            !editingProduct
              ? handleAgregarProducto(v)
              : handleEditarProducto(v);
          }}
          requiredMark={false}
        >
          <Form.Item
            label={
              <span
                style={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                Nombre del Producto <span style={{ color: "red" }}>*</span>
              </span>
            }
            name="nombre"
            getValueFromEvent={(e) => e.target.value.toUpperCase()}
            rules={[
              { required: true, message: "Ingrese el nombre del producto" },
            ]}
          >
            <Input
              placeholder="EJ: JEAN BLESS SKINNY"
              style={{ textTransform: "uppercase" }}
              disabled={editingProduct}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="codigo"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Código <span style={{ color: "red" }}>*</span>
                </span>
              }
              getValueFromEvent={(e) => e.target.value.toUpperCase()}
              rules={[
                { required: true, message: "Ingrese el código del producto" },
              ]}
            >
              <Input
                placeholder="REF-001"
                style={{ textTransform: "uppercase" }}
                disabled={editingProduct}
              />
            </Form.Item>
            <Form.Item
              name="precio"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Precio de Venta <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                { required: true, message: "Ingrese el precio del producto" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={100}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|(\.)/g, "")}
                placeholder="Ej: 25.000"
              />
            </Form.Item>
          </div>

          {!editingProduct ? (
            <>
              <h3 className="font-semibold mb-4 border-b pb-2 font-inter font-xs">
                Stock por Tallas<span style={{ color: "red" }}>*</span>
              </h3>

              {tallas.map((talla) => (
                <div
                  key={talla.id || talla.nombre}
                  className="flex items-center gap-4 mb-3"
                >
                  <Tag color="blue" className="w-12 text-center">
                    {talla.nombre}
                  </Tag>
                  <Form.Item
                    name={["stock_tallas", talla.id || talla.nombre]}
                    noStyle
                  >
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      className="w-full"
                      min={0}
                      onKeyPress={(event) => {
                        if (event.key === "-") {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </div>
              ))}
              {mostrarInputTalla && (
                <div className="flex items-center gap-2 animate-fadeIn bg-slate-50 p-2 rounded-xl border border-dashed border-blue-200">
                  <Input
                    placeholder="Nombre talla (Ej: XL)"
                    value={nuevaTallaNombre}
                    onChange={(e) =>
                      setNuevaTallaNombre(e.target.value.toUpperCase())
                    }
                    className="flex-1 rounded-lg border-blue-300"
                    autoFocus
                  />
                  <Button
                    type="primary"
                    size="small"
                    icon={<Check size={16} />}
                    className="bg-emerald-500! hover:bg-emerald-600! border-none rounded-lg"
                    onClick={() => {
                      handleAgregarTalla(nuevaTallaNombre);
                    }}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined className="text-red-400" />}
                    onClick={() => {
                      setMostrarInputTalla(false);
                      setNuevaTallaNombre("");
                    }}
                  />
                </div>
              )}

              {!mostrarInputTalla && (
                <Button
                  type="dashed"
                  onClick={() => setMostrarInputTalla(true)}
                  block
                  icon={<IoMdAddCircle size={18} />}
                  className="mt-2 border-gray-300 text-gray-500 h-10 rounded-xl hover:text-[#1a2e4c] hover:border-[#1a2e4c] font-inter flex items-center justify-center gap-2 transition-all"
                >
                  Agregar otra talla
                </Button>
              )}
            </>
          ) : null}

          <div className="mt-8 flex gap-3">
            <Button
              className="flex-1 h-11 rounded-lg"
              onClick={() => setOpenDrawer(false)}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              className="flex-1 h-11 rounded-lg bg-[#1a2e4c]"
              htmlType="submit"
            >
              {editingProduct ? "Actualizar Precio" : "Guardar Producto"}
            </Button>
          </div>
        </Form>
      </Drawer>
      <Modal
        title={`Gestionar Stock: ${selectedProductForStock?.nombre}`}
        open={isStockModalVisible}
        onCancel={() => setIsStockModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={stockForm} layout="vertical" onFinish={onFinishStock}>
          <div className="bg-blue-50 p-3 rounded-lg mb-4 text-[13px] text-blue-800 font-inter">
            Gestiona las cantidades actuales o{" "}
            <strong>asocia una nueva talla</strong>.
          </div>
          <div className="grid grid-cols-1 gap-2 mb-6">
            {selectedProductForStock?.ProductoTallas?.map((pt) => {
              const tallaId = pt.Talla?.id || pt.id_talla;

              return (
                <div
                  key={`stock-row-${tallaId}`}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border"
                >
                  <span className="font-bold text-gray-700 w-24 uppercase text-xs font-poppins">
                    Talla {pt.Talla?.nombre || pt.talla}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-gray-400 font-inter">
                      Actual: {pt.stock}
                    </span>
                    <Form.Item name={["actualizar", tallaId]} noStyle>
                      <InputNumber
                        min={0}
                        placeholder="+0"
                        className="w-20"
                        onKeyPress={(event) => {
                          if (event.key === "-") {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 bg-slate-50/50 p-3 rounded-xl border-dashed border-gray-300">
            <p className="text-[11px] font-bold text-[#1a2e4c] mb-3 uppercase tracking-wider font-poppins">
              ¿Falta una talla? Vincúlala aquí:
            </p>
            <div className="flex gap-2">
              <Form.Item name="nueva_talla_id" className="flex-1 mb-0">
                <Select
                  placeholder="Seleccionar talla disponible"
                  showSearch
                  optionFilterProp="label"
                  options={tallas
                    .filter(
                      (tallaGlobal) =>
                        !selectedProductForStock?.ProductoTallas?.some(
                          (pt) =>
                            pt.Talla.id === (tallaGlobal.id || tallaGlobal.id),
                        ),
                    )
                    .map((t) => ({
                      label: `TALLA ${t.nombre}`,
                      value: t.id || t.id_talla,
                    }))}
                />
              </Form.Item>

              <Form.Item name="nueva_talla_stock" className="w-24 mb-0">
                <InputNumber
                  min={1}
                  placeholder="Cant."
                  className="w-full"
                  onKeyPress={(event) => {
                    if (event.key === "-") {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Button
                type="primary"
                className="bg-blue-600"
                onClick={() => {
                  const id = stockForm.getFieldValue("nueva_talla_id");
                  const cant = stockForm.getFieldValue("nueva_talla_stock");
                  if (!id || !cant)
                    return toast.warning("Elige talla y cantidad");
                  const datos = {
                    id_producto: selectedProductForStock.id,
                    id_talla: id,
                    stock: cant,
                  };
                  handleAgregarTallaAProducto(datos);
                }}
              >
                Añadir
              </Button>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              onClick={() => setIsStockModalVisible(false)}
              className="flex-1"
            >
              Cerrar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="flex-1 bg-emerald-600 border-none"
            >
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ListaProductos;
