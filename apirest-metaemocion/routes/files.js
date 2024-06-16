const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    const originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, originalName);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ code: 400 });
  }
  res.status(200).send({ code: 200, file });
});

router.put("/:filename", upload.single("file"), async (req, res) => {
  const oldFilename = req.params.filename;
  const newFile = req.file;

  if (!newFile) {
    return res.status(400).send({ code: 400 });
  }

  const oldFilePath = path.join(__dirname, "../public", oldFilename);

  try {
    if (await fs.pathExists(oldFilePath)) {
      await fs.remove(oldFilePath);
    } else {
      return res.status(404).send({ code: 404 });
    }
    res.status(200).send({ code: 200 });
  } catch (error) {
    res.status(500).send({ code: 500, error });
  }
});

router.delete("/:filename", async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../public", filename);

  try {
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      res.status(200).send({ code: 200 });
    } else {
      res.status(404).send({ code: 404 });
    }
  } catch (error) {
    res.status(500).send({ code: 500, error });
  }
});

router.get("/", async (req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, "../public"));
    const fileList = files.map((file) => ({
      name: file,
      url: `${req.protocol}://${req.get("host")}/public/${file}`,
    }));
    res.status(200).send({ code: 200, fileList });
  } catch (error) {
    res.status(500).send({ code: 500, error });
  }
});

module.exports = router;
