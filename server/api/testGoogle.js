const router = require('express').Router();
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename:
    './google-vision-keys.json' ||
    JSON.parse(process.env.GOOGLE_CONFIDENTIAL_KEY),
});

// const googleCloud = new Storage({
//   keyFilename:
//     './google-vision-keys.json' ||
//     JSON.parse(process.env.GOOGLE_CONFIDENTIAL_KEY),
//   projectId: 'payuppal-bucket-storage',
// });

// getComputedStyle.getBuckets().then((x) => console.log(x));

router.get('/', async (req, res, next) => {
  try {
    console.log(req);
    const arr = [];
    console.log('hello from google api');
    const [result] = await client.textDetection('public/receipt5.jpeg');
    const detections = result.textAnnotations;
    detections.forEach((text) => arr.push(text));
    const newArr = arr[0].description.split('\n');
    res.send(detections);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
