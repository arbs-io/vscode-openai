import { StatusBarServiceProvider } from '@app/apis/vscode';
import { ConversationConfig as convCfg } from '@app/services';
import {
  IConfigurationOpenAI,
  IConversation,
  IMessage,
  IChatCompletion,
} from '@app/interfaces';

import { ChatCompletionMessageCallback, createOpenAI } from '@app/apis/openai';
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionRequestMessageEmbedding,
  ChatCompletionRequestMessageStandard,
  LogChatCompletion,
} from '@app/apis/openai/api/chatCompletionMessages';

export async function createChatCompletionMessage(
  conversation: IConversation,
  configurationOpenAI: IConfigurationOpenAI,
  chatCompletionCallback: ChatCompletionMessageCallback
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

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- non-stream'
    );

    const cfg: ChatCompletionCreateParamsNonStreaming = {
      model: configurationOpenAI.model,
      messages: chatCompletionMessages,
    };

    if (convCfg.presencePenalty !== 0)
      {cfg.presence_penalty = convCfg.presencePenalty;}
    if (convCfg.frequencyPenalty !== 0)
      {cfg.frequency_penalty = convCfg.frequencyPenalty;}
    if (convCfg.temperature !== 0.2) {cfg.temperature = convCfg.temperature;}
    if (convCfg.topP !== 1) {cfg.top_p = convCfg.topP;}
    if (convCfg.maxTokens !== undefined) {cfg.max_tokens = convCfg.maxTokens;}

    const results = await openai.chat.completions.create(cfg, requestConfig);

    const content = results.choices[0].message.content;
    if (!content) {return true;} // Empty but not failed
    const message: IMessage = {
      content: content,
      completionTokens: results.usage?.completion_tokens
        ? results.usage?.completion_tokens
        : 0,
      promptTokens: results.usage?.prompt_tokens
        ? results.usage?.prompt_tokens
        : 0,
      totalTokens: results.usage?.total_tokens
        ? results.usage?.total_tokens
        : 0,
    };

    if (message) {
      const author = `${conversation?.persona.roleName} (${conversation?.persona.configuration.service})`;
      const chatCompletion: IChatCompletion = {
        content: message.content,
        author: author,
        timestamp: new Date().toLocaleString(),
        mine: false,
        completionTokens: message.completionTokens,
        promptTokens: message.promptTokens,
        totalTokens: message.totalTokens,
      };
      chatCompletionCallback('onWillAnswerMessage', chatCompletion);
    }
    LogChatCompletion(message);

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    );
  } catch (error: any) {
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- non-stream (failed)'
    );
    return false;
  }
  return true;
}
