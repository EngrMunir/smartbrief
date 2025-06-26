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
exports.SummaryController = exports.repromptSummary = exports.deleteSummary = exports.updateSummary = void 0;
const catchAsync_1 = require("../../app/utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const summary_service_1 = require("./summary.service");
const fs_1 = __importDefault(require("fs"));
const readTxtOrDocx_1 = require("../../app/utils/readTxtOrDocx");
const path_1 = __importDefault(require("path"));
const mammoth_1 = __importDefault(require("mammoth"));
const promises_1 = require("fs/promises");
const generateSummary = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { originalText, prompt } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId)
        throw new Error("User ID is required");
    const result = yield summary_service_1.SummaryServices.generateSummary(userId, originalText, prompt);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Summary generated successfully',
        data: result,
    });
}));
const getUserSummaries = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId)
        throw new Error("User ID is required");
    const result = yield summary_service_1.SummaryServices.getUserSummaries(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User summaries retrieved successfully',
        data: result,
    });
}));
const getAllSummaries = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield summary_service_1.SummaryServices.getAllSummaries();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All summaries retrieved successfully',
        data: result,
    });
}));
exports.updateSummary = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const { summary: updatedText } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    if (!userId)
        throw new Error("User ID is required");
    if (!userRole)
        throw new Error("User Role is required");
    const result = yield summary_service_1.SummaryServices.updateSummary(userId, id, updatedText, userRole);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Summary updated successfully',
        data: result,
    });
}));
exports.deleteSummary = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    if (!userId)
        throw new Error("User ID is required");
    if (!userRole)
        throw new Error("User Role is required");
    yield summary_service_1.SummaryServices.deleteSummary(userId, id, userRole);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Summary deleted successfully',
        data: null,
    });
}));
const generateSummaryFromFile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    const prompt = req.body.prompt;
    if (!filePath) {
        return res.status(400).json({ message: 'File not uploaded' });
    }
    const originalText = yield (0, readTxtOrDocx_1.readTxtOrDocx)(filePath);
    if (!userId)
        throw new Error("User ID is required");
    const result = yield summary_service_1.SummaryServices.generateSummary(userId, originalText, prompt);
    yield (0, promises_1.unlink)(filePath); // delete file after processing
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Summary generated from file successfully',
        data: result,
    });
}));
const uploadAndGenerateSummary = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const file = req.file;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const prompt = req.body.prompt;
    if (!file)
        throw new Error('No file uploaded');
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    let originalText = '';
    if (ext === '.txt') {
        originalText = fs_1.default.readFileSync(file.path, 'utf-8');
    }
    else if (ext === '.docx') {
        const result = yield mammoth_1.default.extractRawText({ path: file.path });
        originalText = result.value;
    }
    else {
        throw new Error('Unsupported file type');
    }
    if (!userId)
        throw new Error("User ID is required");
    const summary = yield summary_service_1.SummaryServices.generateSummary(userId, originalText, prompt);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Summary generated from uploaded file',
        data: summary,
    });
}));
exports.repromptSummary = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { prompt } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId)
        throw new Error("User ID is required");
    const result = yield summary_service_1.SummaryServices.repromptSummary(userId, id, prompt);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Summary regenerated successfully',
        data: result,
    });
}));
exports.SummaryController = {
    getUserSummaries,
    getAllSummaries,
    generateSummary,
    updateSummary: exports.updateSummary,
    deleteSummary: exports.deleteSummary,
    generateSummaryFromFile,
    uploadAndGenerateSummary,
    repromptSummary: exports.repromptSummary,
};
