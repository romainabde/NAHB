const express = require("express");

const cors = require("cors");
const playRoutes = require("./routes/playRoutes")

const errorHandler = require("./middlewares/errorMiddleware");
const { authMiddleware } = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/play", authMiddleware, playRoutes)

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
