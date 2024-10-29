import AWS from "aws-sdk";

// Configura el cliente de DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Obtiene todas las facturas de DynamoDB.
 * @returns {Array} - Una lista con todos los registros de facturas.
 */
export const getAllFacturas = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return data.Items || [];
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    throw new Error(`Error al obtener las facturas: ${error.message}`);
  }
};
