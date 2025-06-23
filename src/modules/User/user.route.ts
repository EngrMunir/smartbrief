import express from "express";
import { UserController } from "./user.controller";


const router = express.Router();

router.get(
  '/:userEmail',
  UserController.getSingleUser,
);

router.get('/', UserController.getAllUsers);

export const UserRoutes = router;
