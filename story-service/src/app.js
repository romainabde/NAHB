const express = require("express");

const cors = require("cors");
const authorRoutes = require("./routes/authorRoutes")
const readerRoutes = require("./routes/readerRoutes")

const errorHandler = require("./middlewares/errorMiddleware");
const { authMiddleware, requireRole } = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/author/stories", authMiddleware, requireRole("AUTHOR", "ADMIN"), authorRoutes)
app.use("/reader/stories", authMiddleware, readerRoutes)

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
