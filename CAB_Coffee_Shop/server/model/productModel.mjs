import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  image: {
    type: String,
    default: 'coffee.jpg'
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A product must have a description'],
    set: function (desc) {
      desc = desc.toLowerCase();
      const fixed = desc[0].toUpperCase() + desc.slice(1);
      return fixed;
    }
  },
  category: {
    type: String,
    trim: true,
    enum: ['Coffee', 'Tea', 'Merch'],
    required: [true, 'A product must have a category of Coffee, Tea, or Merch'],
    set: function (str) {
      str = str.toLowerCase();
      return str[0].toUpperCase() + str.slice(1);
    }
  },
  unit: {
    type: String,
    trim: true,
    enum: ['grams', 'oz'],
    set: function (u) {
      return u.replace(/g/g, 'grams');
    }
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
