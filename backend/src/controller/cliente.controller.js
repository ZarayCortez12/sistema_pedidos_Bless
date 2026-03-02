const { Cliente, Pedido } = require("../../models");

const listarClientes = async (req, res) => {
  try {
    console.log("Ingreso a la funcion:");

    const clientes = await Cliente.findAll();

    if (!clientes) {
      return res.status(404).json({ message: "No hay clientes" });
    }

    res.json({
      message: "Clientes obtenidos correctamente",
      clientes: clientes,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

const agregarCliente = async (req, res) => {
  try {
    console.log("Agregando cliente:", req.body);
    const { documento, nombres, apellidos, direccion, telefono, email } =
      req.body;

    const clienteExistenteDocumento = await Cliente.findOne({
      where: { documento },
    });

    if (clienteExistenteDocumento) {
      return res.status(400).json({
        type: "info",
        message: "Ya existe un cliente con ese documento",
      });
    }

    const clienteExistenteEmail = await Cliente.findOne({
      where: { email },
    });

    if (clienteExistenteEmail) {
      return res.status(400).json({
        type: "info",
        message: "Ya existe un cliente con ese correo electrónico",
      });
    }

    const cliente = await Cliente.create({
      documento,
      nombres,
      apellidos,
      direccion,
      telefono,
      email,
    });

    if (!cliente) {
      return res.status(404).json({ message: "No hay clientes" });
    }

    return res.json({
      message: "Cliente agregado correctamente",
      cliente: cliente,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al agregar cliente" });
  }
};

const editarCliente = async (req, res) => {
  try {
    console.log("Editando cliente:", req.body);
    const { id } = req.params;
    const { direccion, telefono, email } = req.body;

    const cliente = await Cliente.findOne({
      where: { id },
    });

    if (!cliente) {
      return res.status(404).json({
        message: "No existe el cliente solicitado",
      });
    }

    cliente.direccion = direccion;
    cliente.telefono = telefono;
    cliente.email = email;

    await cliente.save();

    const clienteResponse = await Cliente.findOne({
      where: { id: cliente.id },
    });

    return res.json({
      message: "Cliente editado correctamente",
      cliente: clienteResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al editar cliente" });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    console.log("Eliminando cliente:", req.params.id);
    const { id } = req.params;

    const cliente = await Cliente.findOne({
      where: { id },
    });

    if (!cliente) {
      return res.status(404).json({
        message: "No existe el cliente solicitado",
      });
    }

    const pedidosRegistrados = await Pedido.findAll({
      where: { clienteId: cliente.id },
    });

    if (pedidosRegistrados.length > 0) {
      return res.status(400).json({
        message: "No se puede eliminar el cliente. Tiene pedidos asociados",
      });
    }

    await cliente.destroy();

    return res.json({
      message: "Cliente eliminado correctamente",
      id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al eliminar cliente" });
  }
};

module.exports = {
  listarClientes,
  agregarCliente,
  editarCliente,
  eliminarCliente,
};
