import express from 'express';
import { loginRoute } from './routes/login.routes';
import { usuarioRoute } from './routes/usuario.routes';
import { loginValidator } from './validators/login.validator';

export const app = express();
app.use(express.json());
app.use("/usuarios", usuarioRoute);
app.use("/login", loginRoute);


