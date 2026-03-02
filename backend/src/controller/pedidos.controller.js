const {
  Pedido,
  Cliente,
  DetallePedido,
  Producto,
  Usuario,
  Talla,
  ProductoTalla,
} = require("../../models");

const listarPedidosDeCliente = async (req, res) => {
  try {
    console.log("Ingreso a la funcion:");
    const { id } = req.params;

    const pedidos = await Pedido.findAll({
      where: { clienteId: id },
      include: [
        {
          model: DetallePedido,
        },
      ],
    });

    if (!pedidos) {
      return res.status(404).json({ message: "No hay pedidos" });
    }

    return res.json({
      message: "Pedidos del cliente obtenidos correctamente",
      pedidos,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

const detallesPedido = async (req, res) => {
  try {
    console.log("Ingreso a la funcion:");
    const { pedidoId } = req.params;
    console.log("Parametro pedidoId:", pedidoId);

    const pedido = await Pedido.findOne({
      where: { id: pedidoId },
      include: [
        {
          model: Cliente,
        },
        {
          model: Usuario,
        },
      ],
    });

    if (!pedido) {
      return res.status(404).json({ message: "No hay pedidos" });
    }

    const detalles = await DetallePedido.findAll({
      where: { pedidoId },
      include: [
        {
          model: Producto,
        },
        {
          model: Talla,
        },
      ],
    });

    const productosMap = {};

    detalles.forEach((d) => {
      const productoId = d.productoId;

      if (!productosMap[productoId]) {
        productosMap[productoId] = {
          id: d.Producto.id,
          nombre: d.Producto.nombre,
          codigo: d.Producto.codigo,
          precio: d.Producto.precio,
          tallas: [],
        };
      }

      productosMap[productoId].tallas.push({
        id: d.Talla.id,
        nombre: d.Talla.nombre,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal,
      });
    });

    const productos = Object.values(productosMap);

    const response = {
      id: pedido.id,
      total: pedido.total,
      fecha: pedido.fecha,

      cliente: pedido.Cliente,
      usuario: pedido.Usuario,

      productos,
    };

    return res.json({
      message: "Detalles del pedido obtenidos correctamente",
      pedido: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

const listarPedidos = async (req, res) => {
  try {
    console.log("Ingreso a la funcion:");

    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Cliente,
        },
        {
          model: Usuario,
        },
      ],
    });

    if (!pedidos) {
      return res.status(404).json({ message: "No hay pedidos" });
    }

    return res.json({
      message: "Pedidos obtenidos correctamente",
      pedidos,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

const agregarPedido = async (req, res) => {
  try {
    console.log("Agregando pedido:", req.body);
    const { id_usuario, id_cliente, total, detalles } = req.body;

    const pedidoCreado = await Pedido.create({
      usuarioId: id_usuario,
      clienteId: id_cliente,
      total,
      fecha: new Date(),
    });

    for (const d of detalles) {
      const { id_producto, talla, cantidad, precio_unitario, subtotal } = d;

      await DetallePedido.create({
        pedidoId: pedidoCreado.id,
        productoId: id_producto,
        tallaId: talla,
        cantidad,
        precio_unitario,
        subtotal,
      });

      const stockProductoTalla = await ProductoTalla.findOne({
        where: {
          productoId: id_producto,
          tallaId: talla,
        },
      });

      if (!stockProductoTalla) {
        return res.status(404).json({
          message: "No existe stock para este producto y talla",
        });
      }

      if (stockProductoTalla.stock < cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto ${id_producto}`,
        });
      }

      await stockProductoTalla.update({
        stock: stockProductoTalla.stock - cantidad,
      });
    }

    const pedidoResponse = await Pedido.findOne({
      where: { id: pedidoCreado.id },
      include: [
        {
          model: Cliente,
        },
        {
          model: Usuario,
        },
      ],
    });

    return res.json({
      message: "Pedido agregado correctamente",
      pedido: pedidoResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al agregar pedido" });
  }
};

module.exports = {
  listarPedidosDeCliente,
  detallesPedido,
  listarPedidos,
  agregarPedido,
};
