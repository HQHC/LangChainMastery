import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { Document } from 'langchain/document';

@Controller('/schema')
export class APIController {
  @Inject()
  ctx: Context;

  @Get('/document')
  async document() {
    const doc = new Document({ pageContent: 'foo' });

    // {
    //     "pageContent": "foo",
    //     "metadata": {}
    // }

    return doc;
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
