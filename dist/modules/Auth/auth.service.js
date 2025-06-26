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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_utils_1 = require("./auth.utils");
const user_model_1 = require("../User/user.model");
const AppError_1 = __importDefault(require("../../app/errors/AppError"));
const config_1 = __importDefault(require("../../app/config"));
// Register user
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExistByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    console.log('user');
    if (user)
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'User already exists!');
    // Provide default credits
    payload.credits = 5;
    const result = yield user_model_1.User.create(payload);
    return result;
});
// Login user
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExistByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    const isPasswordCorrect = yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password not match!');
    }
    const jwtPayload = {
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        _id: user === null || user === void 0 ? void 0 : user._id,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret);
    // ✅ Save refresh token in DB
    yield user_model_1.User.findByIdAndUpdate(user._id, { refreshToken });
    return {
        accessToken,
        refreshToken,
    };
});
// Refresh token logic
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield user_model_1.User.isUserExistByEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret);
    return {
        accessToken,
    };
});
// Logout user and clear refreshToken
const logoutUser = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOneAndUpdate({ refreshToken }, { refreshToken: null }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found during logout.');
    }
    return result;
});
exports.AuthService = {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser,
};
