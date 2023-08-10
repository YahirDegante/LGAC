const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { mongoURI } = require('../utils/database.js');
const mongoose = require('mongoose');

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: Date.now().toString(),
      bucketName: 'uploadedDocuments',
      metadata: {
        user: req.params._id,
        file: file.originalname,
      },
    };
  },
});
const upload = multer({ storage });

const conn = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let bucketPromise = new Promise((resolve, reject) => {
  conn.once('open', () => {
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploadedDocuments',
    });
    resolve(bucket);
  });

  conn.on('error', (error) => {
    reject(error);
  });
});

const getBucket = async () => {
  try {
    const bucket = await bucketPromise;
    return bucket;
  } catch (error) {
    throw new Error('Failed to get GridFSBucket: ' + error.message);
  }
};

module.exports = {
  upload,
  getBucket,
};
