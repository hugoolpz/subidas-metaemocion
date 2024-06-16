const jwt = require("jsonwebtoken");

const autenticarToken = (req, res, next) => {
  const token = req.header("token-privado");

  if (!token) {
    return res.status(401).send({
      exito: false,
      error: "Acceso denegado, no existe token",
    });
  }

  try {
    const decodificacion = jwt.verify(token, "token-privado");
    req.body.usuario = decodificacion;
  } catch (error) {
    return res.status(401).send({
      exito: false,
      error: "Debes autenticarte",
    });
  }

  next();
};

module.exports = autenticarToken;
