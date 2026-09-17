import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { requireConfigValue } from "../utils/config";

let s3Client: S3Client | null = null;

export const getS3Client = () => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: requireConfigValue("AWS_S3_REGION"),
      credentials: {
        accessKeyId: requireConfigValue("AWS_S3_ACCESS_KEY_ID"),
        secretAccessKey: requireConfigValue("AWS_S3_SECRET_ACCESS_KEY"),
      },
    });
  }

  return s3Client;
};

class s3Service {
  async uploadFile(
    file: any,
    folder: string,
    filename: string,
  ): Promise<string | null> {
    try {
      const key = `${folder}/${filename}`;
      const bucket = requireConfigValue("AWS_S3_BUCKET");
      const region = requireConfigValue("AWS_S3_REGION");

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const data = await getS3Client().send(command);
      console.log(data);
      return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    } catch (error) {
      console.error("UPLOAD FAILED:", error);
      return null;
    }
  }

  async deleteFile(fileUrl: string): Promise<string | null> {
    try {
      const fileKey = this.extractFileId(fileUrl);
      const command = new DeleteObjectCommand({
        Bucket: requireConfigValue("AWS_S3_BUCKET"),
        Key: fileKey,
      });

      const data = await getS3Client().send(command);
      console.log(data);

      return "File deleted successfully";
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  extractFileId(fileUrl: string): string {
    try {
      const url = new URL(fileUrl);

      return url.pathname.replace(/^\/+/, "").replace(/\.[^/.]+$/, "");
    } catch (error) {
      console.error("Invalid Cloudinary URL:", fileUrl);
      return "";
    }
  }
}

const awsS3Service = new s3Service();
export default awsS3Service;
