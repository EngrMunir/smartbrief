"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Summary = void 0;
const mongoose_1 = require("mongoose");
const summarySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    originalText: { type: String, required: true },
    summary: { type: String, required: true },
    prompt: { type: String },
    wordCount: { type: Number, required: true },
}, { timestamps: true });
exports.Summary = (0, mongoose_1.model)('Summary', summarySchema);
