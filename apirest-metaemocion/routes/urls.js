const express = require("express");
const Url = require("../models/Url");

const router = express.Router();

// Crear una nueva URL
router.post("/", async (req, res) => {
  try {
    const { name, url } = req.body;
    const newUrl = new Url({ name, url });
    await newUrl.save();
    res.status(200).json({ code: 200, newUrl });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message });
  }
});

// Leer todas las URLs
router.get("/", async (req, res) => {
  try {
    const urls = await Url.find();
    res.status(200).json({ code: 200, urls });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// Leer una URL por ID
router.get("/:id", async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) {
      return res.status(404).json({ code: 404, message: "URL not found" });
    }
    res.status(200).json({ code: 200, url });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// Actualizar una URL por ID
router.put("/:name", async (req, res) => {
  try {
    const { name, url } = req.body;
    const updatedUrl = await Url.findOneAndUpdate(
      { name: req.params.name },
      { name, url },
      { new: true, runValidators: true }
    );
    if (!updatedUrl) {
      return res.status(404).json({ code: 404, message: "URL not found" });
    }
    res.status(200).json({ code: 200, updatedUrl });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message });
  }
});

// Eliminar una URL por ID
router.delete("/:name", async (req, res) => {
  try {
    const deletedUrl = await Url.findOneAndDelete({ name: req.params.name });
    if (!deletedUrl) {
      return res.status(404).json({ code: 404, message: "URL not found" });
    }
    res.status(200).json({ code: 200, message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
