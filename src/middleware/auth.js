import jwt from "jsonwebtoken";

export async function auth(req, res, next) {
  try {
    const token = req.header("Token");
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    req.userId = decoded._id;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
}
