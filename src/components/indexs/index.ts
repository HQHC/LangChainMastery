import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

@Controller('/indexs')
export class APIController {
  @Inject()
  ctx: Context;

  @Get('/')
  async indexs() {
    const loader = new TextLoader('src/text/神里凌华.txt');

    const docs = await loader.load();

    return docs;
  }

  @Get('/split')
  async splitTxt() {
    const loader = new TextLoader('src/text/神里凌华.txt');

    const docs = await loader.loadAndSplit(
      new RecursiveCharacterTextSplitter()
    );

    return docs;
  }

  @Get('/hnswlib')
  async hnswlib() {
    const loader = new TextLoader('src/text/神里凌华.txt');

    const docs = await loader.loadAndSplit(
      new RecursiveCharacterTextSplitter()
    );

    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings(
        {},
        {
          basePath: process.env.BASE_PATH,
        }
      )
    );

    // console.log(vectorStore, 'vectorStore');

    const resultOne = await vectorStore.similaritySearch('神里凌华');

    return resultOne;
  }

  @Get('/hnswlibDoc')
  async hnswlibDoc() {
    const loader = new TextLoader('src/text/神里凌华.txt');

    const docs = await loader.loadAndSplit(
      new RecursiveCharacterTextSplitter(
        { chunkSize: 100, chunkOverlap: 2 }
      )
    );

    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings(
        {},
        {
          basePath: process.env.BASE_PATH,
        }
      )
    );

    const resultOne = await vectorStore.similaritySearch('神里凌华', 3);

    return resultOne;
  }
}
