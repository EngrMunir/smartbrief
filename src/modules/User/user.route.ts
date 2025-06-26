import express from "express";
import { UserController } from "./user.controller";
import auth from "../../app/middleware/auth";


const router = express.Router();

router.get('/my-profile', auth(), UserController.getMyProfile);

router.get('/', UserController.getAllUsers);

router.post('/recharge-credits', auth(), UserController.rechargeCredits);

export const UserRoutes = router;
