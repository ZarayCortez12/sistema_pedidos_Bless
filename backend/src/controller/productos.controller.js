const { Producto, Talla, ProductoTalla } = require("../../models");

const listarProductos = async (req, res) => {
  try {
    console.log("Ingreso a la funcion:");
    const productos = await Producto.findAll({
      include: [
        {
          model: ProductoTalla,
          include: [
            {
              model: Talla,
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });
    return res.json({
      message: "Productos obtenidos correctamente",
      productos,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

const agregarProducto = async (req, res) => {
  try {
    console.log("Agregando producto:", req.body);
    const { nombre, codigo, precio, stock_talla } = req.body;

    const productoExistenteNombre = await Producto.findOne({
      where: { nombre },
    });

    if (productoExistenteNombre) {
      return res.status(400).json({
        message: "Ya existe un producto con ese nombre",
      });
    }

    const productoExistenteCodigo = await Producto.findOne({
      where: { codigo },
    });

    if (productoExistenteCodigo) {
      return res.status(400).json({
        message: "Ya existe un producto con ese código",
      });
    }

    const producto = await Producto.create({
      nombre,
      codigo,
      precio,
    });

    if (stock_talla && stock_talla.length > 0) {
      const data = stock_talla.map((st) => ({
        productoId: producto.id,
        tallaId: st.id_talla,
        stock: st.stock,
      }));

      await ProductoTalla.bulkCreate(data);
    }

    const productoResponse = await Producto.findOne({
      where: { id: producto.id },
      include: [
        {
          model: ProductoTalla,
          include: [
            {
              model: Talla,
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });

    return res.json({
      message: "Producto agregado correctamente",
      producto: productoResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

const editarProducto = async (req, res) => {
  try {
    console.log("Editando producto:", req.body);
    const { id } = req.params;
    const { precio } = req.body;

    const producto = await Producto.findOne({
      where: { id },
    });

    if (!producto) {
      return res.status(404).json({
        message: "No existe el producto solicitado",
      });
    }

    producto.precio = precio;

    await producto.save();

    const productoResponse = await Producto.findOne({
      where: { id: producto.id },
      include: [
        {
          model: ProductoTalla,
          include: [
            {
              model: Talla,
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });

    return res.json({
      message: "Producto editado correctamente",
      producto: productoResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    console.log("Eliminando producto:", req.params.id);
    const { id } = req.params;

    const producto = await Producto.findOne({
      where: { id },
    });

    if (!producto) {
      return res.status(404).json({
        message: "No existe el producto solicitado",
      });
    }

    const productoUsado = await ProductoTalla.findOne({
      where: { productoId: producto.id },
    });

    if (productoUsado) {
      return res.status(400).json({
        message: "No se puede eliminar el producto. Tiene tallas asociadas",
      });
    }

    await producto.destroy();

    return res.json({
      message: "Producto eliminado correctamente",
      id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

const ingresarStockAProducto = async (req, res) => {
  try {
    console.log("Ingresando stock a producto:", req.body);
    const { id_producto, actualizar } = req.body;

    const producto = await Producto.findOne({
      where: { id: id_producto },
    });

    if (!producto) {
      return res.status(404).json({
        message: "No existe el producto solicitado",
      });
    }

    for (const actualizacion of actualizar) {
      const { id_producto_talla, nuevo_stock } = actualizacion;

      const productoTalla = await ProductoTalla.findOne({
        where: { id: id_producto_talla },
      });

      if (!productoTalla) {
        return res.status(404).json({
          message: "No existe la relación talla-producto solicitada",
        });
      }

      const nuevoValor = productoTalla.stock + nuevo_stock;

      await productoTalla.update({
        stock: nuevoValor,
      });
    }

    const productoResponse = await Producto.findOne({
      where: { id: producto.id },
      include: [
        {
          model: ProductoTalla,
          include: [
            {
              model: Talla,
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });

    return res.json({
      message: "Stock actualizado correctamente",
      producto: productoResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

const agregarTallaAProducto = async (req, res) => {
  try {
    console.log("Agregando talla a producto:", req.body);
    const { id_producto, id_talla, stock } = req.body;

    const producto = await Producto.findOne({
      where: { id: id_producto },
    });

    if (!producto) {
      return res.status(404).json({
        message: "No existe el producto solicitado",
      });
    }

    await ProductoTalla.create({
      productoId: producto.id,
      tallaId: id_talla,
      stock,
    });

    const productoResponse = await Producto.findOne({
      where: { id: producto.id },
      include: [
        {
          model: ProductoTalla,
          include: [
            {
              model: Talla,
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });

    return res.json({
      message: "Talla agregada correctamente",
      producto: productoResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  listarProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  ingresarStockAProducto,
  agregarTallaAProducto,
};
