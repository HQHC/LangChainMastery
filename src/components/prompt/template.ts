import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  PipelinePromptTemplate,
} from 'langchain/prompts';

@Controller('/prompt')
export class APIController {
  @Inject()
  ctx: Context;

  @Get('/template')
  async template() {
    const template = 'What is a good name for a company that makes {product}?';
    const promptA = new PromptTemplate({
      template,
      inputVariables: ['product'],
    });

    // We can use the `format` method to format the template with the given input values.
    const responseA = await promptA.format({ product: 'colorful socks' });
    return responseA;
  }

  @Get('/createTemplate')
  async createTemplate() {
    const template = 'What is a good name for a company that makes {product}?';
    const promptA = new PromptTemplate({
      template,
      inputVariables: ['product'],
    });

    // We can also use the `fromTemplate` method to create a `PromptTemplate` object
    const responseA = await promptA.format({ product: 'colorful socks1' });
    return responseA;
  }

  @Get('/aiTemplate')
  async aiTemplate() {
    const promptA = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        'You are a helpful assistant that translates {input_language} to {output_language}.'
      ),
      HumanMessagePromptTemplate.fromTemplate('{text}'),
    ]);

    // For chat models, we provide a `ChatPromptTemplate` class that can be used to format chat prompts.
    const responseA = await promptA.format({
      input_language: 'English',
      output_language: 'French',
      text: 'I love programming.',
    });
    return responseA;
  }

  @Get('/formatTemplate')
  async formatTemplate() {
    const promptA = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        'You are a helpful assistant that translates {input_language} to {output_language}.'
      ),
      HumanMessagePromptTemplate.fromTemplate('{text}'),
    ]);

    // For chat models, we provide a `ChatPromptTemplate` class that can be used to format chat prompts.
    const responseA = await promptA.formatPromptValue({
      input_language: 'English',
      output_language: 'French',
      text: 'I love programming.',
    });
    return responseA.toChatMessages();
  }

  @Get('/pipeTemplate')
  async pipeTemplate() {
    const fullPrompt = PromptTemplate.fromTemplate(`{introduction}
    {example}
    {start}`);

    const introductionPrompt = PromptTemplate.fromTemplate(
      `You are impersonating {person}.`
    );

    const examplePrompt =
      PromptTemplate.fromTemplate(`Here's an example of an interaction:
      Q: {example_q}
      A: {example_a}`);

    const startPrompt = PromptTemplate.fromTemplate(`Now, do this for real!
    Q: {input}
    A:`);

    const composedPrompt = new PipelinePromptTemplate({
      pipelinePrompts: [
        {
          name: 'introduction',
          prompt: introductionPrompt,
        },
        {
          name: 'example',
          prompt: examplePrompt,
        },
        {
          name: 'start',
          prompt: startPrompt,
        },
      ],
      finalPrompt: fullPrompt,
    });

    const formattedPrompt = await composedPrompt.format({
      person: 'Elon Musk',
      example_q: `What's your favorite car?`,
      example_a: 'Telsa',
      input: `What's your favorite social media site?`,
    });

    return formattedPrompt;
  }
}
