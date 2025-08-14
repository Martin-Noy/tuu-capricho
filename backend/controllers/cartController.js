import CartItem from '../models/cartItem.js';
import Product from '../models/product.js';

// Obtener los items del carrito
export const getCartItems = async (req, res) => {
  try {
    const items = await CartItem.findAll({ include: Product });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
};

// Agregar item al carrito
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    if (quantity > product.stock) {
      return res.status(400).json({ message: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.` });
    }
    let item = await CartItem.findOne({ where: { productId } });
    if (item) {
      const newQuantity = item.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.` });
      }
      item.quantity = newQuantity;
      await item.save();
    } else {
      item = await CartItem.create({ productId, quantity });
    }
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar al carrito', error });
  }
};

// Actualizar cantidad de un item en el carrito
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await CartItem.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    const product = await Product.findByPk(item.productId);
    if (quantity > product.stock) {
      return res.status(400).json({ message: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.` });
    }
    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el item', error });
  }
};

// Eliminar item del carrito
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CartItem.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el item', error });
  }
};
