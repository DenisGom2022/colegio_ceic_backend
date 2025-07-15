import express from 'express';
import { loginRoute } from './routes/login.routes';
import { usuarioRoute } from './routes/usuario.routes';
import { catedraticoRoute } from './routes/catedratico.routes';
import { alumnoRoute } from './routes/alumno.route';

export const app = express();
app.use(express.json());
app.use("/usuarios", usuarioRoute);
app.use("/login", loginRoute);
app.use("/catedratico", catedraticoRoute);
app.use("/alumno", alumnoRoute);


