import express from 'express';
import cors from 'cors';
import { loginRoute } from './routes/login.routes';
import { usuarioRoute } from './routes/usuario.routes';
import { catedraticoRoute } from './routes/catedratico.routes';
import { alumnoRoute } from './routes/alumno.route';
import { cicloRoute } from './routes/ciclo.routes';
import { cursoRoute } from './routes/curso.routes';
import { nivelAcademicoRoute } from './routes/nivelAcademico.routes';
import { jornadaRoute } from './routes/jornada.routes';
import { gradoRoute } from './routes/grado.routes';
import { gradoCicloRoute } from './routes/gradoCiclo.routes';
import { asignacionCatedraticoRoute } from './routes/asignacionCatedratico.routes';


export const app = express();
app.use(cors());
app.use(express.json());
app.use("/usuarios", usuarioRoute);
app.use("/login", loginRoute);
app.use("/catedratico", catedraticoRoute);
app.use("/alumno", alumnoRoute);
app.use("/ciclo", cicloRoute);
app.use("/curso", cursoRoute);
app.use("/nivel-academico", nivelAcademicoRoute);
app.use("/jornada", jornadaRoute);
app.use("/grado", gradoRoute);
app.use("/grado-ciclo", gradoCicloRoute);
app.use("/asignacion-catedratico", asignacionCatedraticoRoute);