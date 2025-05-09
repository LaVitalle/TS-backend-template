import express from "express";
import allRoutes from './routes/appRoutes';
import cookieParser from "cookie-parser";

const app = express();
const routes = allRoutes;

app.use(express.json());
app.use(cookieParser());
app.use('/', routes);

export default app;