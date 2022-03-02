import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../model/productModel.mjs';
import Customer from '../model/customerModel.mjs';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true
  })
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

const customers = JSON.parse(
  readFileSync(new URL('./customers.json', import.meta.url), 'utf-8')
);
const products = JSON.parse(
  readFileSync(new URL('./products.json', import.meta.url), 'utf-8')
);

const importData = async () => {
  try {
    await Customer.create(customers);
    await Product.create(products);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Customer.deleteMany();
    await Product.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
