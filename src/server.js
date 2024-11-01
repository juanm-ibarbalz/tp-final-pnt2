import express from "express";
import cors from "cors";
import routesFacturas from "./routes/routesFacturas.js";
import routesUsuarios from "./routes/routesUsuarios.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/facturas", routesFacturas);
app.use("/api/usuarios", routesUsuarios);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});
