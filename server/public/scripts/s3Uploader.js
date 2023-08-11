const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { createRequest } = require("@aws-sdk/util-create-request");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { fromEnv } = require("@aws-sdk/credential-provider-env");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

async function uploadFile(file) {
  const fileName = `${Date.now()}_${file.originalname}`;
  console.log("fileName:", fileName);
  const fileType = file.mimetype;
  const fileBuffer = file.buffer;

  const putObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(putObjectParams);
    await s3.send(command);

    const request = await createRequest(s3, command);
    const fileUrl = formatUrl(request);

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

module.exports = { uploadFile };
