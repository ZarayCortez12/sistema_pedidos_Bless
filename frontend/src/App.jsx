import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSesion from "./pages/InicioSesion.jsx";
import MainLayout from "./components/MainLayout.jsx";
import PrivateRoute from "./app/PrivateRoute.jsx";
import Inicio from "./pages/Inicio.jsx";
import ListaProductos from "./pages/ListaProductos.jsx";
import ListaClientes from "./pages/ListaClientes.jsx";
import ListaPedidos from "./pages/ListaPedidos.jsx";
import DetallesPedido from "./pages/DetallesPedido.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route element={<PrivateRoute />}>
          <Route path="/:rol" element={<MainLayout />}>
            <Route path="inicio" element={<Inicio />} />

            <Route path="productos" element={<ListaProductos />} />

            <Route path="clientes" element={<ListaClientes />} />
            <Route path="clientes/pedidos/:id" element={<DetallesPedido />} />

            <Route path="pedidos" element={<ListaPedidos />} />
            <Route path="pedidos/:id" element={<DetallesPedido />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
