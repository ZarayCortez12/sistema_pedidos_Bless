import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, ConfigProvider } from "antd";
import { FaUser } from "react-icons/fa";
import { PiUserSwitch } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../images/icono.png";
import Logo_Completo from "../images/logo-bless.jpg";
import { useMenusPorRol } from "../utils/menuConfig";
import ScrollToTop from "./ScrollToTop";
import { obtenerUsuarioActual } from "../features/usuario.slice";

const { Header, Sider, Content } = Layout;

function MainLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usuario = useSelector((state) => state.usuario.usuario);
  const menusPorRol = useMenusPorRol();

  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(!usuario);

  useEffect(() => {
    if (!usuario) {
      dispatch(obtenerUsuarioActual()).finally(() => setLoading(false));
    }
  }, [dispatch, usuario]);

  const pathname = location.pathname.split("/")[2] || "inicio";

  const handleLogout = () => {
    toast.info("Cerrando sesión...");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1a2e4c] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#1a2e4c] font-medium animate-pulse">
            Cargando sistema...
          </span>
        </div>
      </div>
    );

  if (!usuario) return <Navigate to="/" replace />;

  const rolActivo = usuario.rol_activo;
  const itemsMenu = menusPorRol[rolActivo] || [];

  const handleCambiarRol = (nuevoRol) => {
    dispatch(
      cambiarRolActivo({
        id_usuario: usuario.id_usuario,
        nuevoRol: nuevoRol.id,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success(`Cambiando a rol: ${nuevoRol.nombre}`);
        dispatch(obtenerUsuarioActual());
      })
      .catch(() => toast.error("Error al cambiar el rol"));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1a2e4c",
          borderRadius: 8,
        },
      }}
    >
      <Layout
        style={{ minHeight: "100vh" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          collapsedWidth={75}
          className="bg-white shadow-xl z-20 fixed h-full left-0 top-0"
          style={{
            background: "#fff",
            position: "fixed",
          }}
        >
          <div className="h-14 flex items-center justify-center p-2 mb-3 mt-3 overflow-hidden">
            <img
              src={collapsed ? Logo : Logo_Completo}
              alt="Logo"
              className={`transition-all duration-300 ${collapsed ? "w-40" : "w-40"}`}
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            onClick={({ key }) => {
              if (key === "signout") {
                //handleLogoutClick();
              } else {
                navigate(`/${rolActivo}/${key}`);
              }
            }}
            items={itemsMenu}
            className="border-none px-3!"
          />
          <div className="absolute bottom-4 w-full text-center text-gray-400 text-[10px] uppercase">
            © 2026 • Organización Bless
          </div>
        </Sider>

        <Layout
          className="bg-slate-50 transition-all duration-300"
          style={{ marginLeft: collapsed ? 70 : 220, minHeight: "100vh" }}
        >
          <Header className="flex items-center justify-between bg-[#1a2e4c] px-6 h-16 shadow-md sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4 -ml-6">
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  style: { color: "white", fontSize: "20px" },
                  className:
                    "cursor-pointer hover:text-blue-200 transition-colors",
                  onClick: () => setCollapsed(!collapsed),
                },
              )}
              <span className="text-white/30 hidden md:inline">|</span>
              <h1 className="text-white font-bold hidden md:block uppercase tracking-widest text-xs font-inter">
                Panel de Gestión
              </h1>
            </div>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: (
                      <div className="px-2 py-1 border-b border-gray-100 mb-1">
                        <p className="font-bold text-gray-800 m-0">
                          {capitalize(
                            `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`.trim() ||
                              "Usuario",
                          )}
                        </p>
                        <p className="text-[10px] text-gray-400 m-0 uppercase">
                          {usuario.rol_activo}
                        </p>
                      </div>
                    ),
                    disabled: true,
                  },
                  ...(usuario.roles || [])
                    .filter((r) => r.nombre !== rolActivo)
                    .map((r) => ({
                      key: `role-${r.id}`,
                      icon: <PiUserSwitch className="text-blue-600" />,
                      label: `Cambiar a ${capitalize(r.nombre)}`,
                      onClick: () => handleCambiarRol(r),
                    })),
                  { type: "divider" },
                  {
                    key: "logout",
                    icon: <LogoutOutlined className="text-red-500" />,
                    label: "Cerrar Sesión",
                    danger: true,
                    onClick: handleLogout,
                  },
                ],
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all group -mr-10">
                <div className="hidden sm:flex flex-col text-right leading-none">
                  <span className="text-white font-bold text-sm tracking-wide font-Inter">
                    {capitalize(
                      `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`.trim() ||
                        "Usuario",
                    )}
                  </span>
                  <span className="text-blue-200/80 text-[10px] uppercase font-semibold mt-1 font-inter">
                    {rolActivo}
                  </span>
                </div>
                <Avatar
                  size={38}
                  className="bg-white shadow-inner flex items-center justify-center border-2 border-white/20"
                  icon={<FaUser className="text-white" />}
                />
                <DownOutlined style={{ color: "white", fontSize: "10px" }} />
              </div>
            </Dropdown>
          </Header>

          <Content className="p-4! md:p-6 flex flex-col">
            <div
              className="bg-white rounded-2xl shadow-sm p-4"
              style={{ minHeight: "calc(100vh - 160px)" }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
      <ToastContainer theme="colored" />
    </ConfigProvider>
  );
}

export default MainLayout;
