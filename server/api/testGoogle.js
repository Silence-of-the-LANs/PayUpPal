const router = require('express').Router();
const vision = require('@google-cloud/vision');
// const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename:
    './google-vision-keys.json' ||
    JSON.parse(process.env.GOOGLE_CONFIDENTIAL_KEY),
});

// const storage = multer.memoryStorage({
//   destination: function (req, file, callback) {
//     callback(null, '');
//   },
// });

router.post('/', async (req, res, next) => {
  try {
    console.log('hello');
    console.log(req);
    const arr = [];
    const [result] = await client.textDetection('public/receipt5.jpeg');
    const detections = result.textAnnotations;
    detections.forEach((text) => arr.push(text));
    const newArr = arr[0].description.split('\n');
    res.send('hello');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
