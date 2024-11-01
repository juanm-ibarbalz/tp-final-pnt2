import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getFacturasByUserId(id_usuario) {
  const params = {
    TableName: process.env.DYNAMODB_FACTURAS_TABLE_NAME,
    IndexName: "id_usuario-index",
    KeyConditionExpression: "id_usuario = :id_usuario",

    ExpressionAttributeValues: {
      ":id_usuario": id_usuario,
    },
  };

  try {
    const data = await dynamoDB.query(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error al obtener las facturas por id_usuario:", error);
    throw new Error("Error al obtener las facturas por id_usuario");
  }
}

export async function getFacturas() {
  const params = {
    TableName: process.env.DYNAMODB_FACTURAS_TABLE_NAME,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error al obtener todas las facturas:", error);
    throw new Error("Error al obtener todas las facturas");
  }
}
