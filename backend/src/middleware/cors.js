import cors from 'cors';
import config from '../config/index.js';

const allowedOrigins = config.corsOrigin === '*'
  ? null
  : config.corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (e.g. Postman, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins === null || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204,
};

export default cors(corsOptions);
