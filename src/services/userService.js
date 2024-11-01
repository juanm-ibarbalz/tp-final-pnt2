import AWS from "aws-sdk";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
dotenv.config();

export async function registerUser(user) {
  user.password = await bcryptjs.hash(user.password, 10);
  user.id_usuario = 2; //TODO: Cambiar por UUID: "AWS.util.uuid.v4()"

  const params = {
    TableName: process.env.DYNAMODB_USUARIOS_TABLE_NAME,
    Item: user,
  };

  try {
    await dynamoDB.put(params).promise();
    return { id: user.id_usuario, email: user.email };
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    throw new Error("No se pudo registrar el usuario");
  }
}

export async function findByCredentials(email, password) {
  const params = {
    TableName: process.env.DYNAMODB_USUARIOS_TABLE_NAME,

    //TODO: Cambiar por metodo con index

    //IndexName: "email-index", // Suponiendo que creaste un GSI para el campo `email`
    //KeyConditionExpression: "email = :email",

    //borrar, solo testeo
    FilterExpression: "email = :email",

    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    //const data = await dynamoDB.query(params).promise();

    //cambiar, solo testeo
    const data = await dynamoDB.scan(params).promise();
    const user = data.Items[0];

    if (!user) {
      throw new Error("Credenciales no válidas");
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Credenciales no válidas");
    }

    return user;
  } catch (error) {
    console.error("Error en findByCredentials:", error);
    throw new Error("No se pudo autenticar el usuario");
  }
}

export function generateAuthToken(user) {
  const token = jwt.sign(
    { _id: user.id_usuario, email: user.email },
    process.env.SECRET,
    { expiresIn: "1h" },
  );
  return token;
}
