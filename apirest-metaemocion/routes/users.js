const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

const router = express.Router();

/* router.post("/reg", async (req, res) => {
  try {
    const { nombre, contra } = req.body;

    let contraHash = null;

    if (contra) {
      contraHash = bcrypt.hashSync(contra, 10);
    }

    const usuario = new User({
      _id: new mongoose.Types.ObjectId(),
      username: nombre,
      password: contraHash,
    });

    const nuevoUsuario = await usuario.save();
    return res.status(200).json({ exito: true, datos: nuevoUsuario });
  } catch (error) {
    return res.status(500).json({ exito: false, error });
  }
}); */

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const usuario = await User.findOne().where("username").equals(username);

  if (usuario) {
    if (bcrypt.compareSync(password, usuario.password.toString())) {
      const token = jwt.sign(
        {
          username: usuario.username,
        },
        "token-privado",
        { expiresIn: "2d" }
      );
      res.send({
        code: 200,
        usuario,
        token: token,
      });
    } else {
      res.send({
        code: 400,
        error: "Contraseña incorrecta",
      });
    }
  } else {
    res.status(404).json({
      code: 404,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ code: 200, users });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
});

module.exports = router;
