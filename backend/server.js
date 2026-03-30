import express from 'express';
import corsMiddleware from './src/middleware/cors.js';
import errorHandler from './src/middleware/errorHandler.js';
import routes from './src/routes/index.js';
import config from './src/config/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

app.use('/api', routes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Multikart backend listening on port ${config.port}`);
});
