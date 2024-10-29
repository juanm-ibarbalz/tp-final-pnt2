import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

// Crear el cliente de DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Función para obtener todas las facturas
export async function getAllFacturas() {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return data.Items; // Retorna las facturas obtenidas
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
  }
}
