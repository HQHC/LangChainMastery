import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TimeWeightedVectorStoreRetriever } from 'langchain/retrievers/time_weighted';
import {
  GenerativeAgent,
  GenerativeAgentMemory,
} from 'langchain/experimental/generative_agents';
import { OpenAI } from 'langchain/llms/openai';

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

  @Get('/memoryVector')
  async memoryVector() {
    const oenpAIConfig = {
      basePath: process.env.BASE_PATH,
    };

    const llm = new OpenAI(
      {
        temperature: 0.9,
        maxTokens: 1500,
      },
      oenpAIConfig
    );

    const loader = new DirectoryLoader('src/text/神里凌华', {
      '.txt': path => new TextLoader(path),
    });

    const docs = await loader.load();

    const vectorStore = new MemoryVectorStore(
      new OpenAIEmbeddings({}, oenpAIConfig)
    );

    const retriever = new TimeWeightedVectorStoreRetriever({
      vectorStore,
      otherScoreKeys: ['importance'],
      k: 15,
    });

    // await retriever.addDocuments(docs);

    const linghuaMemory: GenerativeAgentMemory = new GenerativeAgentMemory(
      llm,
      retriever,
      { reflectionThreshold: 8 }
    );

    const linghua: GenerativeAgent = new GenerativeAgent(llm, linghuaMemory, {
      name: '神里凌华',
      age: 25,
      traits: '端庄娴静、风雅有礼',
      status: '',
    });

    await Promise.all(
      docs.map(({ pageContent }) => {
        return linghua.memory.addMemory(pageContent);
      })
    );

    const [, reaction1] = await linghua.generateReaction('你好呀，凌华');
    // console.log(reaction1, 'reaction')

    const [, reaction2] = await linghua.generateReaction('最近忙啥呢？');

    const [, reaction3] = await linghua.generateReaction('你怎么看待996？');

    const [, reaction4] = await linghua.generateReaction('生命的意义是什么呢？')

    // const [, reaction1] = await linghua.generateDialogueResponse(
    //   '你好呀，凌华'
    // );
    console.log(reaction1);

    // const [, reaction2] = await linghua.generateDialogueResponse(
    //   '最近忙啥呢？'
    // );
    console.log(reaction2);
    // return await linghua.getSummary({ forceRefresh: true });

    console.log(reaction3);

    console.log(reaction4);
  }

  @Get('/xiaoVector')
  async xiaoVector() {
    const oenpAIConfig = {
      basePath: process.env.BASE_PATH,
    };

    const llm = new OpenAI(
      {
        temperature: 0.9,
        maxTokens: 1500,
      },
      oenpAIConfig
    );

    const loader = new DirectoryLoader('src/text/魈', {
      '.txt': path => new TextLoader(path),
    });

    const docs = await loader.load();

    const vectorStore = new MemoryVectorStore(
      new OpenAIEmbeddings({}, oenpAIConfig)
    );

    const retriever = new TimeWeightedVectorStoreRetriever({
      vectorStore,
      otherScoreKeys: ['importance'],
      k: 15,
    });

    // await retriever.addDocuments(docs);

    const linghuaMemory: GenerativeAgentMemory = new GenerativeAgentMemory(
      llm,
      retriever,
      { reflectionThreshold: 8 }
    );

    const linghua: GenerativeAgent = new GenerativeAgent(llm, linghuaMemory, {
      name: '魈',
      age: 25,
      traits: '勇敢果断、沉默寡言',
      status: '',
    });

    await Promise.all(
      docs.map(({ pageContent }) => {
        return linghua.memory.addMemory(pageContent);
      })
    );

    const [, reaction1] = await linghua.generateReaction('你好呀，魈');
    // console.log(reaction1, 'reaction')

    const [, reaction2] = await linghua.generateReaction('最近忙啥呢？');

    const [, reaction3] = await linghua.generateReaction('你怎么看待996？');

    const [, reaction4] = await linghua.generateReaction('生命的意义是什么呢？')

    // const [, reaction1] = await linghua.generateDialogueResponse(
    //   '你好呀，凌华'
    // );
    console.log(reaction1);

    // const [, reaction2] = await linghua.generateDialogueResponse(
    //   '最近忙啥呢？'
    // );
    console.log(reaction2);
    // return await linghua.getSummary({ forceRefresh: true });

    console.log(reaction3);

    console.log(reaction4);
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
      new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 2 })
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
