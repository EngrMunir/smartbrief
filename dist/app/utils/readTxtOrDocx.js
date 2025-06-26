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
exports.readTxtOrDocx = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mammoth_1 = __importDefault(require("mammoth"));
const readTxtOrDocx = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const ext = path_1.default.extname(filePath).toLowerCase();
    if (ext === '.txt') {
        return yield promises_1.default.readFile(filePath, 'utf-8');
    }
    else if (ext === '.docx') {
        const result = yield mammoth_1.default.extractRawText({ path: filePath });
        return result.value;
    }
    else {
        throw new Error('Unsupported file type. Only .txt and .docx are allowed.');
    }
});
exports.readTxtOrDocx = readTxtOrDocx;
