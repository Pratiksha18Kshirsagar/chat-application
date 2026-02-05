const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const s3 = require("../utils/s3");
require("dotenv").config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `media/${uuidv4()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const result = await s3.upload(params).promise();

    res.json({
      success: true,
      url: result.Location
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
