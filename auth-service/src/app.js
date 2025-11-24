const express = require("express");

const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoute");

const errorHandler = require("./middlewares/errorMiddleware");
const { authMiddleware } = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", authMiddleware, userRoutes);

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
