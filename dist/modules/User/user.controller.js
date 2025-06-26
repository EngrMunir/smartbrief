"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../app/utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
// const getSingleUser = catchAsync(async (req: Request, res: Response) => {
//   const { userEmail } = req.params;
//   const result = await UserServices.getSingleUserFromDB(userEmail);
//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: 'User retrieved successfully',
//     data: result,
//   });
// });
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllUsersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
}));
const rechargeCredits = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    if (userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only admin can recharge credits' });
    }
    const { userId, amount } = req.body;
    const result = yield user_service_1.UserServices.rechargeCredits(userId, amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Credits recharged successfully',
        data: result,
    });
}));
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email)
        throw new Error("User ID is required");
    const result = yield user_service_1.UserServices.getSingleUserFromDB(email);
    console.log('result', result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile fetched successfully',
        data: result,
    });
});
exports.UserController = {
    getAllUsers,
    rechargeCredits,
    getMyProfile
};
