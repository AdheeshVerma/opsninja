import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.AWS_S3_REGION;
const Bucket = process.env.AWS_S3_BUCKET;

export const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

class s3Service {
  async uploadFile(
    file: any,
    folder: string,
    filename: string,
  ): Promise<string | null> {
    try {
      const key = `${folder}/${filename}`;

      const command = new PutObjectCommand({
        Bucket: Bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const data = await s3.send(command);
      console.log(data);
      return `https://${Bucket}.s3.${region}.amazonaws.com/${key}`;
    } catch (error) {
      console.error("UPLOAD FAILED:", error);
      return null;
    }
  }

  async deleteFile(fileUrl: string): Promise<string | null> {
    try {
      const fileKey = this.extractFileId(fileUrl);
      const command = new DeleteObjectCommand({
        Bucket: Bucket,
        Key: fileKey,
      });

      const data = await s3.send(command);
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
