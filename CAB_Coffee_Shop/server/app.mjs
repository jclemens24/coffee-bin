import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import AppError from './utils/appError.mjs';
import compression from 'compression';
import { errorHandler } from './controller/errorController.mjs';
import { router as customerRouter } from './routes/customerRoute.mjs';
import { router as productRouter } from './routes/productRoute.mjs';

dotenv.config({ path: './config.env' });
const app = express();
const port = 8000 || process.env.PORT;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true
  })
  .then(() => console.log('DB Connected Successfully'))
  .catch(err => console.log(err));

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(compression());

app.use('/api/customers', customerRouter);
app.use('/api/products', productRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(errorHandler);

app.listen(port, 'localhost', () => {
  console.log(`Server listening on port ${port}`);
});
