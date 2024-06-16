const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urls");
const fileRoutes = require("./routes/files");
const userRoutes = require("./routes/users");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/urls", urlRoutes);
app.use("/files", fileRoutes);
app.use("/users", userRoutes);
app.use("/public", express.static("public"));

app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});

const connectToMongo = async () => {
  const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB } = process.env;
  const mongoURL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(mongoURL);
    console.log("Éxito al conectar a Mongo");
  } catch (error) {
    console.error("Error al conectar a Mongo:", error);
    process.exit(1);
  }
};

connectToMongo();
