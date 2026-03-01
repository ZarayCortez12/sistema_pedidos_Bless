import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx";
import MainLayout from "./components/MainLayout.jsx";
import PrivateRoute from "./app/PrivateRoute.jsx";
import InicioAdministrador from "./pages/InicioAdministrador.jsx";
import ListaProductos from "./pages/ListaProductos.jsx";
import ListaClientes from "./pages/ListaClientes.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route element={<PrivateRoute allowedRoles={["administrador"]} />}>
          <Route path="/administrador" element={<MainLayout />}>
            <Route path="inicio" element={<InicioAdministrador />} />
            <Route path="productos" element={<ListaProductos />} />
            <Route path="clientes" element={<ListaClientes />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
