import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

@Controller('/models')
export class APIController {
  @Inject()
  ctx: Context;

  @Get('/init')
  async document() {
    const embeddings = new OpenAIEmbeddings();

    const res = await embeddings.embedQuery('Hello world');

    // {
    //     "pageContent": "foo",
    //     "metadata": {}
    // }

    return res;
  }

  @Get('/documentMeta')
  async documentMeta() {
    const doc = new Document({ pageContent: 'foo', metadata: { source: '1' } });

    // {
    //     "pageContent": "foo",
    //     "metadata": {}
    // }

    return doc;
  }
}
