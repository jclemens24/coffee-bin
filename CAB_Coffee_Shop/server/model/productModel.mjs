import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  image: {
    type: String
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A product must have a description']
  },
  category: {
    type: String,
    trim: true,
    enum: ['Coffee', 'Tea', 'Merch'],
    required: [true, 'A product must have a category of Coffee, Tea, or Merch']
  },
  unit: {
    type: String,
    trim: true,
    enum: ['grams', 'oz']
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  weight: {
    type: Number
  },
  quantity: {
    type: Number,
    default: 0
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
