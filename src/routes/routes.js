import express from "express";
import multer from "multer";
import {
  uploadImageToS3,
  notifyApiGateway,
} from "../services/uploadService.js";

import { getAllFacturas } from "../services/facturaService.js";

const router = express.Router();

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No se ha subido ningún archivo." });
  }

  try {
    const s3Data = await uploadImageToS3(file); // Subir imagen a S3
    res.json({ bucket: s3Data.bucket, key: s3Data.key }); // Respuesta final
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/extract", async (req, res) => {
  const { bucket, key, id_usuario } = req.body;

  if (!bucket || !key) {
    return res
      .status(400)
      .json({ error: "Falta el bucket o la key en la request." });
  }

  try {
    const apiResponse = await notifyApiGateway({ bucket, key }, id_usuario);
    res.json(apiResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/facturas", async (req, res) => {
  try {
    const facturas = await getAllFacturas();
    res.json(facturas);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// router.get("/factura/:uuid", async (req, res) => {
//   const { uuid } = req.params;

//   try {
//     const factura = await getFacturaByUUID(uuid);
//     res.json(factura);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/register", async (req, res) => {});

router.post("/login", async (req, res) => {});

export default router;
