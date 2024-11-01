import express from "express";
import {
  registerUser,
  findByCredentials,
  generateAuthToken,
} from "../services/userService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const result = await registerUser(req.body);
  res.send(result);
});

router.post("/login", async (req, res) => {
  try {
    const user = await findByCredentials(req.body.email, req.body.password);
    const token = generateAuthToken(user);
    res.send({ user, token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

export default router;
