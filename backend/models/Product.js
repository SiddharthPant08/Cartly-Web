import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Product title cannot exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },

    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: '',
    },

    images: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isDeal: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    legacyId: {
  type: String,
  required: true,
  unique: true,
},

highlights: {
  type: [String],
  default: [],
},

colors: {
  type: [String],
  default: [],
},

sizes: {
  type: [String],
  default: [],
}
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;