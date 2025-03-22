import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document } from '@langchain/core/documents';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Processes a PDF file by parsing it into Document objects.
 * @param file - The PDF file to process.
 * @returns An array of Document objects extracted from the PDF and the document ID.
 */
export async function processPDF(file: File): Promise<{
  docs: Document[];
  documentId: string;
}> {
  const buffer = await bufferFile(file);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-'));
  const tempFilePath = path.join(tempDir, file.name);

  try {
    await fs.writeFile(tempFilePath, buffer);
    const loader = new PDFLoader(tempFilePath);
    const documentId = uuidv4();
    const processedAt = new Date().toISOString();

    const docs = await loader.load();

    docs.forEach((doc, index) => {
      doc.metadata = {
        ...doc.metadata,
        filename: file.name,
        documentId: documentId,
        chunkIndex: index,
        processedAt: processedAt,
        isUploadedPdf: true
      };
    });

    return {
      docs,
      documentId
    };
  } finally {
    await fs
      .unlink(tempFilePath)
      .catch((err) => console.error('Error deleting temp file:', err));
    await fs
      .rmdir(tempDir)
      .catch((err) => console.error('Error deleting temp dir:', err));
  }
}

/**
 * Converts a File object to a Buffer.
 * @param file - The uploaded file.
 * @returns A Buffer containing the file content.
 */
async function bufferFile(file: File): Promise<Buffer> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error) {
    console.error('Error buffering file:', error);
    throw new Error('Failed to read file content.');
  }
}