// src/app/utils/fileReader.ts
import fs from 'fs/promises';
import path from 'path';
import { Document, Packer } from 'docx';
import * as mammoth from 'mammoth';

export const readTxtOrDocx = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.txt') {
    return await fs.readFile(filePath, 'utf-8');
  } else if (ext === '.docx') {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    throw new Error('Unsupported file type');
  }
};
