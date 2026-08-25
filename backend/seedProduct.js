import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Product from './models/Product.js';
import { products } from '../frontend/src/data/products.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    const formattedProducts = products.map((product) => ({
      legacyId: product.id,

      title: product.title,
      description: product.description,

      price: product.price,
      originalPrice: product.mrp,

      discount: product.mrp
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0,

      category: product.category,
      brand: product.brand,

      images: product.images,

      rating: product.rating,
      reviewCount: product.ratingCount,

      stock: product.stock,

      tags: product.tags,

      highlights: product.highlights || [],
      colors: product.colors || [],
      sizes: product.sizes || [],

      isFeatured: product.tags?.includes('bestseller') || false,
      isDeal: product.tags?.includes('deal') || false,

      isActive: true,
    }));

    await Product.deleteMany({});

    await Product.insertMany(formattedProducts);

    console.log(
      `${formattedProducts.length} products inserted successfully`
    );

    await mongoose.connection.close();

    console.log('Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);

    process.exit(1);
  }
};

seedProducts();