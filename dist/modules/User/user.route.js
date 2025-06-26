"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../app/middleware/auth"));
const router = express_1.default.Router();
router.get('/my-profile', (0, auth_1.default)(), user_controller_1.UserController.getMyProfile);
router.get('/', user_controller_1.UserController.getAllUsers);
router.post('/recharge-credits', (0, auth_1.default)(), user_controller_1.UserController.rechargeCredits);
exports.UserRoutes = router;
