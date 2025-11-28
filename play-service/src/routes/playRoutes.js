const express = require("express");
const playController = require('../controllers/PlayController');
const router = express.Router();

router.get("/stories/:id", playController.getUserStoryProgress);
router.get("/", playController.getStoryProgress);
router.post("/", playController.saveProgress);
router.patch("/:id", playController.updateProgress);

router.get("/stats", playController.getStoryStats);

module.exports = router;