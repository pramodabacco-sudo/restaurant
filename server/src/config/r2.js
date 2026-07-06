// server/src/config/r2.js
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.CF_BUCKET_NAME;
// Public base URL for serving files — set this once you attach a public
// domain or the r2.dev subdomain to the bucket in the Cloudflare dashboard.
const PUBLIC_BASE_URL = process.env.CF_PUBLIC_BASE_URL;

/**
 * Uploads a file buffer to R2 and returns its public URL.
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimeType
 * @param {string} folder - e.g. "menu-items" or "categories"
 */
export async function uploadToR2(fileBuffer, originalName, mimeType, folder = "menu-items") {
  const ext = originalName.split(".").pop();
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    })
  );

  return {
    key,
    url: `${PUBLIC_BASE_URL}/${key}`,
  };
}

export async function deleteFromR2(key) {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

export default r2Client;