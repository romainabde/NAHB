const express = require("express");
const userController = require("../controllers/UserController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/', requireRole("ADMIN"), userController.getUsers)
router.get('/me', userController.getUserInfo)
router.patch('/:id/ban', requireRole("ADMIN"), userController.banUser)

module.exports = router;