import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';

export const readTxtOrDocx = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') {
    return await fs.readFile(filePath, 'utf-8');
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error('Unsupported file type. Only .txt and .docx are allowed.');
  }
};
