import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { TextLoadingError } from "./utils/errors.js";
import { Document } from "langchain/document";

export async function tokenizePlaintextFile(
  filePath: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<Document[]> {
  try {
    // Read the file
    const textLoader = new TextLoader(filePath);
    const document = await textLoader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });
    return await splitter.splitDocuments(document);
  } catch (error: any) {
    console.error("Error tokenizing file:", error);
    if (error instanceof Error) {
        throw new TextLoadingError(error.message);
    } else throw new TextLoadingError(`An error occurred while loading the file at ${filePath}`);
  }
}
