import { RiHome6Fill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi2";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { useMemo } from "react";
import { AiFillProduct } from "react-icons/ai";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

export const useMenusPorRol = () => {
  const menusPorRol = useMemo(() => {
    const menuAdministrador = [
      {
        key: "inicio",
        icon: <RiHome6Fill style={estiloIcono} />,
        label: <span style={estiloLabel}>Inicio</span>,
      },
      {
        key: "productos",
        icon: <AiFillProduct style={estiloIcono} />,
        label: <span style={estiloLabel}>Productos</span>,
      },
      {
        key: "clientes",
        icon: <HiUserGroup style={estiloIcono} />,
        label: <span style={estiloLabel}>Clientes</span>,
      },
      {
        key: "pedidos",
        icon: <MdOutlineProductionQuantityLimits style={estiloIcono} />,
        label: <span style={estiloLabel}>Pedidos</span>,
      },
    ];

    const menuVendedor = [
      {
        key: "inicio",
        icon: <RiHome6Fill style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Inicio</span>,
      },
      {
        key: "productos",
        icon: <AiFillProduct style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Productos</span>,
      },
      {
        key: "clientes",
        icon: <HiUserGroup style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Clientes</span>,
      },
      {
        key: "pedidos",
        icon: <MdOutlineProductionQuantityLimits style={estiloIcono} />,
        label: <span style={estiloLabel}>Pedidos</span>,
      },
    ];

    return { administrador: menuAdministrador, vendedor: menuVendedor };
  });

  return menusPorRol;
};

const estiloLabel = {
  fontSize: "15.5px",
  fontFamily: "Inter",
  color: "currentColor",
};

const estiloIcono = {
  fontSize: "20px",
  color: "currentColor",
};
