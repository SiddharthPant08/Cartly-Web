import { validationResult } from 'express-validator';
import Product from '../models/Product.js';

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {
      isActive: true,
    };

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category
    if (category) {
      filter.category = category;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Rating
    if (minRating !== undefined) {
      filter.rating = {
        $gte: Number(minRating),
      };
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (sort === 'price-low') {
      sortOption = { price: 1 };
    }

    if (sort === 'price-high') {
      sortOption = { price: -1 };
    }

    if (sort === 'rating') {
      sortOption = { rating: -1 };
    }

    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
};



// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      legacyId: req.params.id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};
// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    })
  } catch (error) {
    console.error('Create product error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while creating product',
    })
  }
}


// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    })
  } catch (error) {
    console.error('Update product error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while updating product',
    })
  }
}


// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Delete product error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
    })
  }
}
