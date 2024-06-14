const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/files");
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use("/files", fileRoutes);
app.use("/public", express.static("public"));

app.listen(port, () => {
  console.log(`Servidor en puerto ${port}`);
});
