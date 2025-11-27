const express = require("express");
const readerController = require('../controllers/ReaderController');
const router = express.Router();

router.get('/', readerController.getUserStories);
router.get('/all', readerController.getStoryList);
router.get('/:id', readerController.getStory);

router.get('/:id/pages/first', readerController.getFirstStoryPage);
router.get('/:id/pages', readerController.getStoryPages);
router.get('/pages/:id', readerController.getPage);

router.get('/pages/:id/choices', readerController.getPageChoices);
router.get('/:id/choices', readerController.getStoryChoices);
router.get('/choices/:id', readerController.getChoice);

module.exports = router;