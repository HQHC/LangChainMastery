import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { TimeWeightedVectorStoreRetriever } from 'langchain/retrievers/time_weighted';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

@Controller('/indexs')
export class APIController {
  @Inject()
  ctx: Context;

  @Get('/TimeWeightedVectorStoreRetriever')
  async documentMeta() {
    const vectorStore = new MemoryVectorStore(
      new OpenAIEmbeddings(
        {},
        {
          basePath: process.env.BASE_PATH,
        }
      )
    );

    const retriever = new TimeWeightedVectorStoreRetriever({
      vectorStore,
      memoryStream: [],
      searchKwargs: 2,
    });

    const documents = [
      'My name is John.',
      'My name is Bob.',
      'My favourite food is pizza.',
      'My favourite food is pasta.',
      'My favourite food is sushi.',
    ].map(pageContent => ({ pageContent, metadata: {} }));

    // All documents must be added using this method on the retriever (not the vector store!)
    // so that the correct access history metadata is populated
    await retriever.addDocuments(documents);

    const results1 = await retriever.getRelevantDocuments(
      'What is my favourite food?'
    );

    console.log(results1);

    /*
      [
        Document { pageContent: 'My favourite food is pasta.', metadata: {} }
      ]
       */

    // const results2 = await retriever.getRelevantDocuments(
    //   'What is my favourite food?'
    // );

    // console.log(results2);

    // {
    //     "pageContent": "foo",
    //     "metadata": {}
    // }

    return 1;
  }
}
