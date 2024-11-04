import s3 from "../config/awsConfig.js";
import axios from "axios";

export const uploadImageToS3 = async (file) => {
  const s3Bucket = process.env.AWS_S3_BUCKET;
  const s3Key = `facturas/${file.originalname}`;

  const s3Params = {
    Bucket: s3Bucket,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const s3Data = await s3.upload(s3Params).promise();
    return {
      bucket: s3Bucket,
      key: s3Key,
    };
  } catch (error) {
    throw new Error(`Error subiendo la imagen a S3: ${error.message}`);
  }
};

export const notifyApiGateway = async ({ bucket, key }, id_usuario) => {
  try {
    const apiResponse = await axios.post(process.env.LAMBDA_URL, {
      s3: {
        bucket: bucket,
        key: key,
      },
      id_usuario: id_usuario,
    });
    return apiResponse.data;
  } catch (error) {
    throw new Error(`Error notificando a la API Gateway: ${error.message}`);
  }
};

export const invocarLambda = async (payload) => {
  const params = {
    FunctionName: process.env.LAMBDA_NAME,
    InvocationType: 'RequestResponse', // 'Event' para invocación asíncrona
    Payload: JSON.stringify(payload),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const result = JSON.parse(response.Payload);
    return result;
  } catch (error) {
    console.error('Error al invocar la función Lambda:', error);
    throw error;
  }
};

export default { uploadImageToS3, notifyApiGateway, invocarLambda};
