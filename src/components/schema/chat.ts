import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema';

@Controller('/schema')
export class APIController {
  @Inject()
  ctx: Context;

  initOpenAI() {
    const chat = new ChatOpenAI(
      {
        temperature: 0.7,
      },
      {
        basePath: process.env.BASE_PATH,
      }
    );

    return chat;
  }

  @Get('/system')
  async systemChatMessage() {
    console.log(process.env.BASE_PATH);
    const chat = this.initOpenAI();

    // {
    //      "type": "ai",
    //      "data": {
    //          "content": "Thank you! It's my pleasure to assist you. Is there anything specific you need help with?"
    //      }
    // }
    return await chat.call([new SystemChatMessage('You are a nice assistant')]);
  }

  @Get('/human')
  async humanChatMessage() {
    const chat = this.initOpenAI();

    // {
    //     "type": "ai",
    //     "data": {
    //         "content": "Hello! I'm an AI, so I don't have feelings, but I'm here to help. How can I assist you today?"
    //     }
    // }

    return await chat.call([new HumanChatMessage('Hello, how are you?')]);
  }

  @Get('/ai')
  async aiChatMessage() {
    const chat = this.initOpenAI();

    // {
    //     "type": "ai",
    //     "data": {
    //         "content": "That's great to hear! How can I assist you today?"
    //     }
    // }

    return await chat.call([new AIChatMessage('I am doing well, thank you!')]);
  }

  @Get('/generate')
  async generateMessage() {
    const chat = this.initOpenAI();

    // {
    //     "type": "ai",
    //     "data": {
    //         "content": "That's great to hear! How can I assist you today?"
    //     }
    // }

    return await chat.generate([
      [
        new SystemChatMessage(
          'You are a helpful assistant that translates English to French.'
        ),
        new HumanChatMessage(
          'Translate this sentence from English to French. I love programming.'
        ),
      ],
      [
        new SystemChatMessage(
          'You are a helpful assistant that translates English to French.'
        ),
        new HumanChatMessage(
          'Translate this sentence from English to French. I love artificial intelligence.'
        ),
      ],
    ]);
  }
}
