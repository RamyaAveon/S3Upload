var AWS = require('aws-sdk');
var dotenv = require("dotenv");


AWS.config.update({
  region: process.env.region,
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
});

const S3 = new AWS.S3();
const SNS = new AWS.SNS();
const SQS = new AWS.SQS();
const StepFunctions = new AWS.StepFunctions();

module.exports = {S3,SNS,SQS,StepFunctions};

