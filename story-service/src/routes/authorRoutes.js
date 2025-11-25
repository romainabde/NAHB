const express = require("express");
const authorController = require('../controllers/AuthorController');
const router = express.Router();

router.post("/", authorController.createStory);

router.patch("/:id", authorController.editStory);
router.delete("/:id", authorController.deleteStory);

router.post("/:id/page", authorController.createPage)

module.exports = router;