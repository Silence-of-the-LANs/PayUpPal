const router = require('express').Router();
const vision = require('@google-cloud/vision');
// const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const AWS = require('aws-sdk');
const { checkIfItem } = require('./helperFunctions');

let AWS_ID, AWS_SECRET, AWS_BUCKET_NAME;
let GOOGLE_CONFIDENTIAL_KEY = {};
let GOOG_KEY;

if (process.env.NODE_ENV !== 'production') {
  const awsObject = require('../../secrets');
  AWS_ID = awsObject.AWS_ID;
  AWS_SECRET = awsObject.AWS_SECRET;
  AWS_BUCKET_NAME = awsObject.AWS_BUCKET_NAME;
  GOOGLE_CONFIDENTIAL_KEY = require('../../google-vision-keys.json');
} else {
  console.log('PRODUCTION BLOCK');
  AWS_ID = process.env.AWS_ID;
  AWS_SECRET = process.env.AWS_SECRET;
  AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  GOOG_KEY = process.env.GOOG_KEY;
  // GOOGLE_CONFIDENTIAL_KEY = {
  //   type: process.env.TYPE,
  //   project_id: process.env.PROJECT_ID,
  //   private_key_id: process.env.PRIVATE_KEY_ID,
  //   private_key: process.env.PRIVATE_KEY,
  //   client_email: process.env.CLIENT_EMAIL,
  //   client_id: process.env.CLIENT_ID,
  //   auth_uri: process.env.AUTH_URI,
  //   token_uri: process.env.TOKEN_URI,
  //   auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
  //   client_x509_cert_url: process.env.CLIENT_CERT,
  // };
}

// console.log(typeof GOOGLE_CONFIDENTIAL_KEY);
// console.log(GOOGLE_CONFIDENTIAL_KEY);
// Creates a client
const client = new vision.ImageAnnotatorClient({
  credentials: GOOG_KEY,
});

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
});

// file is referenced in our upload component. <form name='image'>
const upload = multer({ storage }).single('file');

// api/testGoogle
router.post('/', upload, async (req, res, next) => {
  try {
    // ex: req.file.original name -> receipt1.jpg || splits fileName into arr

    let file = req.file.originalname.split('.');
    // fileType = jpg
    const fileType = file[file.length - 1];
    // fileName = receipt1
    const fileName = file[0];
    // params for S3 upload, need ACL to be 'public-read' to make URL public
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileName + `.${fileType}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };
    // uploads the image onto S3 bucket
    const data = await s3.upload(params).promise();
    const arr = [];
    const [result] = await client.textDetection(data.Location);
    const detections = result.textAnnotations;
    detections.forEach((text) => arr.push(text));
    const newArr = arr[0].description.split('\n');
    res.send(newArr);
  } catch (err) {
    next(err);
  }
});

const textSameLine = (text, targetLine) => {
  if (
    Math.abs(text.minY - targetLine.minY < 10) ||
    Math.abs(text.maxY - targetLine.maxY < 10)
  ) {
    return true;
  }
  return false;
};

router.post('/test', upload, async (req, res, next) => {
  try {
    // ex: req.file.original name -> receipt1.jpg || splits fileName into arr
    let file = req.file.originalname.split('.');
    // fileType = jpg
    const fileType = file[file.length - 1];
    // fileName = receipt1
    const fileName = file[0];
    // params for S3 upload, need ACL to be 'public-read' to make URL public
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileName + `.${fileType}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };
    // uploads the image onto S3 bucket
    const data = await s3.upload(params).promise();
    console.log(data);
    const [result] = await client.textDetection(data.Location);
    const detections = result.textAnnotations;
    // create simplied data object
    const textBounds = detections.map((text) => {
      let obj = {};
      obj.description = text.description;
      obj.minX = text.boundingPoly.vertices[0].x;
      obj.minY = text.boundingPoly.vertices[0].y;
      obj.maxY = text.boundingPoly.vertices[3].y;
      return obj;
    });
    // sort minY values from lowest to highest
    let sortByY = textBounds
      .sort((a, b) => {
        if (a.minY < b.minY) {
          return 1;
        } else return -1;
      })
      // sort function only sorted from highest to lowest, so need to reverse
      .reverse();
    // get rid of original description
    let sortByYNoDescription = sortByY.slice(1);
    let line = 1;
    let lineObj = {};
    // new obj created with line1, line2, line3 keys, values represent a text
    // if texts' minY value is within 5 of a previous text, add onto line
    // otherwise create another line
    sortByYNoDescription.forEach((text) => {
      if (line === 1) {
        lineObj[`line${line}`] = [text];
        line++;
      }
      // helper function created check if text belongs to a line
      if (textSameLine(text, lineObj[`line${line - 1}`][0])) {
        lineObj[`line${line - 1}`].push(text);
      } else {
        lineObj[`line${line}`] = [text];
        line++;
      }
    });
    // similar objected created as above, except we will sort by minX
    // we should be able to read each line of a receipt now
    let newLineObj = {};
    Object.keys(lineObj).forEach((key) => {
      let sortByX = lineObj[key]
        .sort((a, b) => {
          if (a.minX < b.minX) {
            return 1;
          }
          return -1;
        })
        // sort function only sorted from highest to lowest, so need to reverse
        .reverse();
      newLineObj[key] = sortByX;
    });
    // new array created to join texts in the same line, each index representing a line
    const textByLines = Object.keys(newLineObj).map((key) => {
      let joinLines = lineObj[key]
        .map((text) => {
          return text.description;
        })
        .join(' ');
      return joinLines;
    });
    const itemList = checkIfItem(textByLines);
    res.send(itemList);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
