import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors());
const port = 8000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.listen(port, 'localhost', () => {
  console.log(`Server listening on port ${port}`);
});
