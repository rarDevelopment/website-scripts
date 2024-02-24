// Import necessary modules from the AWS SDK v3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import 'dotenv/config';

// Create an S3 client with your credentials
const s3Client = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const filePathsToUpload = [
  'discussion-blog-posts.json',
  'discussion-links-posts.json',
  'current-books.json',
  'current-games.json',
  'current-tv.json',
  'recent-books.json',
  'recent-games.json',
  'recent-movies.json',
  'top-albums.json',
  'top-artists.json',
];

filePathsToUpload.forEach(async (fileName) => {
  const filePath = `${process.env.DIRECTORYPATH}${fileName}`;
  // Define the S3 bucket and file details
  const bucketName = 'rardk-web-data-files';
  const key = fileName; // Object key in S3
  const localFilePath = filePath; // Object key in S3
  const fileContent = await readFileSync(localFilePath).toString();

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
      console.log('File uploaded successfully:', data);
    })
    .catch((err) => {
      console.error('Error uploading file:', err);
    });
});
