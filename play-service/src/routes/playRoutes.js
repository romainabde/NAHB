const express = require("express");
const playController = require('../controllers/PlayController');
const router = express.Router();

router.get("/stories/:id", playController.getUserStoryProgress);
router.post("/", playController.saveProgress);

module.exports = router;