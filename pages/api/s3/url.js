import aws from "aws-sdk";
import { getSession } from "next-auth/client";
import { v4 } from "uuid";
import { dbConnect } from "../../../utils/dbConnect";

// Update aws credentials
aws.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_MYAPP,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MYAPP,
  },
  region: process.env.AWS_REGION_MYAPP,
  bucketname: process.env.AWS_BUCKET_NAME,
});

// New S3 class
const s3 = new aws.S3();

/**
 * Generates upload URL from AWS. URL expires in 60 seconds.
 * @param {object} req - http request, including the userId.
 * @param {object} res - http response.
 * @returns a string of a working upload URL.
 */
const generateUploadURL = async ({ userId }, res) => {
  try {
    const imageName = `${userId}/${v4()}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Expires: 60,
    };

    const url = await s3.getSignedUrlPromise("putObject", params);

    return res.status(200).json({ url });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Deletes image object from s3 bucket.
 * @param {object} req - http request, including body and userId.
 * @param {object} res - http response.
 * @returns a string of a success message if image deleted.
 */
const deleteImageFromBucket = async ({ body, userId }, res) => {
  try {
    const { url } = body;

    // Passed URL is in the format: https://[bucket].s3.[region].amazonaws.com/[userId]/[imageId]
    // Split URL and get necessary imageId
    const str = url.split("/");
    const imageId = str[str.length - 1];
    const imageName = `${userId}/${imageId}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    };

    // Delete object from bucket
    await s3.deleteObject(params).promise();

    return res
      .status(200)
      .json({ message: `Image ${imageName} was succesfully deleted from s3.` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// Main
const handler = async (req, res) => {
  const { userId } = await getSession({ req });
  const { method } = req;

  await dbConnect();
  req.userId = userId;

  switch (method) {
    case "GET":
      return generateUploadURL(req, res);
    case "POST":
      return deleteImageFromBucket(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
