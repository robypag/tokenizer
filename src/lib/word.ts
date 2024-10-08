import { Document } from "langchain/document";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { WordLoadingError } from "./utils/errors.js";

export async function tokenizeWordDocument(
  filePath: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<Document[]> {
  try {
    // Step 1: Read the Word document
    const docxBuffer = new DocxLoader(filePath);
    const document = await docxBuffer.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });
    return await splitter.splitDocuments(document);
  } catch (error) {
    console.error("Error tokenizing Word document:", error);
    if (error instanceof Error) {
      throw new WordLoadingError(error.message);
    } else
      throw new WordLoadingError(
        `An error occurred while loading the PDF file at ${filePath}`
      );
  }
}
