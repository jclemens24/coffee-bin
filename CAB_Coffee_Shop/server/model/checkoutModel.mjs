import mongoose from 'mongoose';

const checkoutSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'A checkout must have a customer']
  },
  totalPrice: {
    type: Number,
    required: [true, 'A checkout must have a price']
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});

checkoutSchema.pre('find', function (next) {
  this.populate('customer items');
  next();
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

export default Checkout;
