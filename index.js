const { S3,SNS,SQS,StepFunctions }  = require('./config');
var fs = require("fs");
var chalk = require('chalk');
var http = require('http');


// http.createServer(function (req, res) {
//   fs.readFile('index.html', function(err, data) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(data);
//     return res.end();
//   });
// }).listen(4000);

const readAFile = (fileName) => {
  new Promise((resolve, reject) => {
    fs.readFile('index.html', 'utf-8', (err, data) => {
      if (err) {
        reject(err); // in the case of error, control flow goes to the catch block with the error occured.
      }
      else {
        resolve(data);  // in the case of success, control flow goes to the then block with the content of the file.
      }
    });
  })
    .then((data) => {
      console.log(data);
      const params = {
        Bucket: 'ex10102022s3',   // my bucket name
        Key: fileName,           // file to be uploaded to s3
        ContentType: 'text/html',
        Body: data
      };

      S3.upload(params, (s3err, data) => {
        if (s3err) {
          console.log(s3err);
          throw s3err;
        }
        // console.log(chalk.blue('File uploaded successfully! at Location => ',data.Location));
      });

    })
    .catch((err) => {
      throw err; //  handle error here.
    })
};

// var fileName = 'index.html';

// readAFile(fileName);

module.exports = readAFile;