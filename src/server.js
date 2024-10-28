import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

// Configuración de CORS
app.use(cors());

// Middleware para interpretar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Rutas
app.use("/api", routes);

// Iniciar el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});
