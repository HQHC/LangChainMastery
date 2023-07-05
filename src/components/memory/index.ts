import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { OpenAI } from 'langchain/llms/openai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

@Controller('/memory')
export class APIController {
  @Inject()
  ctx: Context;

  @Get('/buffer')
  async buffer() {
    // 存储对话
    const model = new OpenAI(
      {},
      {
        basePath: process.env.BASE_PATH,
      }
    );

    const memory = new BufferMemory();

    const chain = new ConversationChain({ llm: model, memory });

    await chain.call({ input: "Hi! I'm Jim." });

    const res2 = await chain.call({ input: "What's my name?" });


    return res2;
  }

}
