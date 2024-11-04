import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import {
  uploadImageToS3,
  notifyApiGateway,
  invocarLambda
} from "../services/uploadService.js";
import {
  getFacturasByUserId,
  getFacturas,
} from "../services/facturaService.js";

const router = express.Router();

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", auth, upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No se ha subido ningún archivo." });
  }

  try {
    const s3Data = await uploadImageToS3(file);
    res.json({ bucket: s3Data.bucket, key: s3Data.key });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/extract", auth, async (req, res) => {
  const { bucket, key } = req.body;

  if (!bucket || !key) {
    return res
      .status(400)
      .json({ error: "Falta el bucket o la key en la request." });
  }

  try {
    payload = {
      s3:{
        bucket: bucket,
        key: key
      },
      id_usuario: req.userId
    };
    // const apiResponse = await notifyApiGateway({ bucket, key }, req.userId); // Estoy devolviendo el userId desde la autenticacion, y no desde el body, es buena practica?
    const lambdaResponse = await invocarLambda(payload); // Estoy devolviendo el userId desde la autenticacion, y no desde el body, es buena practica?
    // res.json(apiResponse); // Deberia en realidad ya mandarlo desde el upload y no desde acá? asi no cualquiera sube una factura al s3
    res.json(lambdaResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/usuario/:id_usuario", auth, async (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario);

  if (id_usuario !== req.userId) {
    return res.status(403).json({ error: "Acceso no autorizado" });
  }

  try {
    const facturas = await getFacturasByUserId(id_usuario);
    res.status(200).json(facturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const facturas = await getFacturas();
    res.status(200).json(facturas);
  } catch (error) {
    console.error("Error en la ruta para obtener todas las facturas:", error);
    res.status(500).json({ message: "Error al obtener todas las facturas" });
  }
});

export default router;
