// Import necessary modules from the AWS SDK v3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises"; // Node.js built-in module for reading files
import 'dotenv/config';

// Create an S3 client with your credentials
const s3Client = new S3Client({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
});

const filesToUpload = [
    "discussion-blog-posts.json",
    "discussion-links-posts.json"
];

filesToUpload.forEach(async (filePath) => {
    // Define the S3 bucket and file details
    const bucketName = "rardk-web-data-files";
    const key = filePath; // Object key in S3
    const localFilePath = filePath; // Object key in S3
    const fileContent = await readFile(localFilePath, "utf8");

    // Create a command to upload the file
    const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
    });

    // Execute the upload
    s3Client
        .send(uploadCommand)
        .then((data) => {
            console.log("File uploaded successfully:", data);
        })
        .catch((err) => {
            console.error("Error uploading file:", err);
        });

});
