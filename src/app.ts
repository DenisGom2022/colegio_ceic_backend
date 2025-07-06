import express from 'express';
import { usuarioRoute } from './routes/Usuario.routes';

export const app = express();
app.use(express.json());
app.use("/usuarios", usuarioRoute);


