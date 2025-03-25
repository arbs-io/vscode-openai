import { StatusBarServiceProvider } from '@app/apis/vscode';
import {
  IChatCompletion,
  IConfigurationOpenAI,
  IConversation,
  IMessage,
} from '@app/interfaces';
import { ConversationConfig as convCfg } from '@app/services';

import { createInfoNotification } from '@app/apis/node';
import {
  ChatCompletionMessageCallback,
  ChatCompletionStreamCallback,
  createOpenAI,
  errorHandler,
} from '@app/apis/openai';
import {
  ChatCompletionCreateParamsStreaming,
  ChatCompletionRequestMessageEmbedding,
  ChatCompletionRequestMessageStandard,
  LogChatCompletion,
} from '@app/apis/openai/api/chatCompletionMessages';
import { APIUserAbortError } from "openai";

export async function createChatCompletionStream(
  conversation: IConversation,
  configurationOpenAI: IConfigurationOpenAI,
  messageCallback: ChatCompletionMessageCallback,
  streamCallback: ChatCompletionStreamCallback,
  abortSignal?: AbortSignal
): Promise<boolean> {
  try {
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- build-conversation'
    );

    const openai = await createOpenAI(configurationOpenAI.baseURL);
    const chatCompletionMessages = conversation.embeddingId
      ? await ChatCompletionRequestMessageEmbedding(conversation)
      : await ChatCompletionRequestMessageStandard(conversation);

    const requestConfig = await configurationOpenAI.requestConfig;
    requestConfig.signal = abortSignal;

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- stream'
    );

    const cfg: ChatCompletionCreateParamsStreaming = {
      model: configurationOpenAI.model,
      messages: chatCompletionMessages,
      stream: true,
    };

    if (convCfg.presencePenalty !== 0) { cfg.presence_penalty = convCfg.presencePenalty; }
    if (convCfg.frequencyPenalty !== 0) { cfg.frequency_penalty = convCfg.frequencyPenalty; }
    if (convCfg.temperature !== 0.2) { cfg.temperature = convCfg.temperature; }
    if (convCfg.topP !== 1) { cfg.top_p = convCfg.topP; }
    if (convCfg.maxTokens !== undefined) { cfg.max_tokens = convCfg.maxTokens; }

    const results = await openai.chat.completions.create(cfg, requestConfig);

    const author = `${conversation?.persona.roleName} (${conversation?.persona.configuration.service})`;
    const chatCompletion: IChatCompletion = {
      content: '',
      author: author,
      timestamp: new Date().toLocaleString(),
      mine: false,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0,
    };
    messageCallback('onWillAnswerMessage', chatCompletion);

    let tokenCount = 0;
    let fullContent = '';
    for await (const chunk of results) {
      const content = chunk.choices[0]?.delta?.content ?? '';

      streamCallback('onWillAnswerMessageStream', content);

      fullContent += content;
      tokenCount++;
    }

    const message: IMessage = {
      content: fullContent,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: tokenCount || 0,
    };
    LogChatCompletion(message);

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    );
  } catch (error: any) {
    if (error instanceof APIUserAbortError) {
      createInfoNotification(error.message);
      return true;
    } else if (error.code === 'unsupported_value' && error.param === 'stream') {
      // Check if model allows stream...
      StatusBarServiceProvider.instance.showStatusBarInformation(
        'sync~spin',
        '- stream (failed)'
      );
      return false;
    } else {
      errorHandler(error);
    }
  }
  return true;
}
