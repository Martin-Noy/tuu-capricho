import { Sequelize } from 'sequelize';
import Product from '../models/product.js';

export async function seedProducts() {
  const baseProducts = [
    {
      name: 'Plancha de stickers',
      photos: [],
      basePrice: 250,
      percentage: 0,
      description: 'Stickers decorativos para agendas y cuadernos.',
      stock: 100
    },
    {
      name: 'Goma',
      photos: [],
      basePrice: 80,
      percentage: 0,
      description: 'Goma de borrar suave y precisa.',
      stock: 100
    },
    {
      name: 'Lapicera',
      photos: [],
      basePrice: 120,
      percentage: 0,
      description: 'Lapicera de tinta azul, ideal para escribir.',
      stock: 100
    },
    {
      name: 'Regla',
      photos: [],
      basePrice: 90,
      percentage: 0,
      description: 'Regla de 20cm transparente.',
      stock: 100
    },
    {
      name: 'Cuaderno',
      photos: [],
      basePrice: 350,
      percentage: 0,
      description: 'Cuaderno de hojas rayadas, tapa dura.',
      stock: 50
    }
  ];

  for (const prod of baseProducts) {
    const exists = await Product.findOne({ where: { name: prod.name } });
    if (!exists) await Product.create(prod);
  }
}
