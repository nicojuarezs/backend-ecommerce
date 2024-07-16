const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// GET users
router.get("/users", userController.getUsers);
// GET users by id
router.get("/users/:id", userController.getUserByid);
// POST users
router.post("/users", userController.postUser);
// DELETE users
router.delete("/users/:id", [ auth, isAdmin ] , userController.deleteUser);
// PUT users
router.put("/users/:id", auth, userController.updateUser);
// POST login
router.post("/login", userController.login);

module.exports = router;
