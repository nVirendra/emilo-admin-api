
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js'
import roleRoutes from './routes/role.routes.js'
import menuRoutes from './routes/menu.routes.js'
import userRoutes from './routes/user.routes.js'
import serviceRoute from './routes/service.route.js'
import reportRoutes from './routes/report.routes.js'

dotenv.config();
const app = express();


const allowedOrigins = ["http://localhost:5173", "https://eavin.emilo.in"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Enable cookies
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev', {
  skip: (req) => req.method === 'OPTIONS'
}));

// Routes
app.get('/', (req, res) => {
  res.send('SoftCorner Welcomes you API is running...');
});

app.use('/api/admin/auth',authRoutes);
app.use('/api/admin/menus',menuRoutes);
app.use('/api/admin/roles',roleRoutes);
app.use('/api/admin/users',userRoutes);
app.use('/api/admin/service',serviceRoute)
app.use('/api/admin/reports',reportRoutes)


app.use(errorHandler);

export default app;
