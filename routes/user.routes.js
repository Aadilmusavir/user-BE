import express from "express";
import {
    createUserController,
    getUsersController,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", createUserController);
router.get("/users", getUsersController);

export default router;
