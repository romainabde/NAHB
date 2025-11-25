const express = require("express");
const authorController = require('../controllers/AuthorController');
const router = express.Router();

router.post("/", authorController.createStory);
router.post("/:id/pages", authorController.createPage)
router.post("/pages/:id/choices", authorController.createChoice)

router.patch("/:id", authorController.editStory);
router.patch("/pages/:id", authorController.editPage);
router.patch("/choices/:id", authorController.editChoice);

router.delete("/:id", authorController.deleteStory);
router.delete("/pages/:id", authorController.deletePage);
router.delete("/choices/:id", authorController.deleteChoice);



module.exports = router;