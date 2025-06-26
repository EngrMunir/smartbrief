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
exports.SummaryServices = void 0;
const config_1 = __importDefault(require("../../app/config"));
const user_model_1 = require("../User/user.model");
const AppError_1 = __importDefault(require("../../app/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const summary_model_1 = require("./summary.model");
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.default.gemini_api_key);
// const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
const generateSummary = (userId, originalText, prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    if (user.credits <= 0)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Insufficient credits');
    const fullPrompt = prompt || 'Summarize this content in 3-5 lines:';
    const inputText = `${fullPrompt}\n\n${originalText}`;
    const result = yield model.generateContent([inputText]);
    const response = yield result.response;
    const summaryText = response.text() || 'Summary not available.';
    const wordCount = summaryText.split(' ').length;
    const saved = yield summary_model_1.Summary.create({
        user: user._id,
        originalText,
        summary: summaryText,
        prompt: fullPrompt,
        wordCount,
    });
    user.credits -= 1;
    yield user.save();
    return saved;
});
const getUserSummaries = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return summary_model_1.Summary.find({ user: userId }).sort({ createdAt: -1 });
});
const updateSummary = (userId, summaryId, updatedText, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const summary = yield summary_model_1.Summary.findById(summaryId);
    if (!summary)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Summary not found');
    if (userRole !== 'editor' && summary.user.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to edit this summary');
    }
    summary.summary = updatedText;
    summary.wordCount = updatedText.split(' ').length;
    yield summary.save();
    return summary;
});
const deleteSummary = (userId, summaryId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const summary = yield summary_model_1.Summary.findById(summaryId);
    if (!summary)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Summary not found');
    if (!['admin', 'editor'].includes(userRole) && summary.user.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to delete this summary');
    }
    yield summary_model_1.Summary.findByIdAndDelete(summaryId);
});
const repromptSummary = (userId, summaryId, newPrompt) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    if (user.credits <= 0)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Insufficient credits');
    const oldSummary = yield summary_model_1.Summary.findById(summaryId);
    if (!oldSummary)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Original summary not found');
    if (oldSummary.user.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to reprompt this summary');
    }
    const prompt = (newPrompt === null || newPrompt === void 0 ? void 0 : newPrompt.trim()) || 'Summarize this content in 3-5 lines:';
    const inputText = `${prompt}\n\n${oldSummary.originalText}`;
    const result = yield model.generateContent([inputText]);
    const response = result.response;
    const summaryText = response.text() || 'Summary not available.';
    const wordCount = summaryText.split(' ').length;
    const newSummary = yield summary_model_1.Summary.create({
        user: user._id,
        originalText: oldSummary.originalText,
        summary: summaryText,
        prompt,
        wordCount,
    });
    user.credits -= 1;
    yield user.save();
    return newSummary;
});
const getAllSummaries = () => __awaiter(void 0, void 0, void 0, function* () {
    return summary_model_1.Summary.find().populate('user', 'name email role').sort({ createdAt: -1 });
});
exports.SummaryServices = {
    generateSummary,
    getUserSummaries,
    updateSummary,
    deleteSummary,
    repromptSummary,
    getAllSummaries
};
