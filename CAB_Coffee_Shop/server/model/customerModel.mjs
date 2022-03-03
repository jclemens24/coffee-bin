import mongoose from 'mongoose';
import validator from 'validator';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A customer must have a name'],
      trim: true,
      minlength: [3, 'A name must be longer than 3 characters, got {VALUE}'],
      maxlength: [50, 'A name cannot be longer than 50 characters, got {VALUE}']
    },
    email: {
      type: String,
      required: [true, 'A customer must have an email'],
      trim: true,
      validate: {
        validator: validator.isEmail,
        message:
          'Email format must be test@example.com. {VALUE} is an invalid email'
      },
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      validate: {
        validator: function (num) {
          return /\d{3}-\d{3}-\d{4}/.test(num);
        },
        message: num => `${num.value} is not a valid phone number`
      },
      default: null
    },
    birthday: {
      type: Date,
      get: date => Math.ceil(new Date().toUTCString() - date)
    },
    age: {
      type: Number,
      set: function () {
        return Math.ceil(new Date().toUTCString() - this.birthday);
      }
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      state: {
        type: String,
        maxlength: [2, 'A state can only be 2 digits, got {VALUE}']
      },
      zip: {
        type: Number,
        maxlength: [5, 'A zip code must be 5 digits, got {VALUE}']
      }
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
