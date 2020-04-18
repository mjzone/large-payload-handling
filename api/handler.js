const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const s3 = new AWS.S3();

module.exports.getSignedUrl = async (event) => {
  try {
    const bucket = "<your-uniq-s3-bucket-name>";
    const key = uuidv4();
    const expireSeconds = 60 * 5;

    const url = s3.getSignedUrl("putObject", {
      Bucket: bucket,
      Key: key,
      Expires: expireSeconds,
      ContentType: "application/json",
    });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ url }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ err }),
    };
  }
};

module.exports.executePayload = async (event) => {
  try {
    const s3Event = event.Records[0].s3;
    const params = {
      Bucket: s3Event.bucket.name,
      Key: s3Event.object.key,
    };
    let data = await s3.getObject(params).promise();
    let result = JSON.parse(data.Body.toString());
    console.log(result);
    /* Execute your business logic here. */
  } catch (err) {
    throw new Error(err);
  }
};
