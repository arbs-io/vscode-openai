import { IChatMessage } from '../../interfaces/IChatMessage'

export const SampleChatMessages: IChatMessage[] = [
  {
    content: 'Are you familiar with "prompt engineering"?',
    author: 'Andrew Butson',
    timestamp: 'Yesterday, 10:15 PM',
    mine: true,
  },
  {
    content:
      "Yes, as an AI language model, I am familiar with the concept of prompt engineering.\n\nPrompt engineering refers to the process of designing and refining prompts for an AI language model in order to improve its performance on a specific task or set of tasks. This involves carefully crafting the input text that the model receives in order to elicit the desired output.\n\nThe goal of prompt engineering is to optimize the language model's ability to generate high-quality, relevant responses to a given prompt, which can be especially important in natural language generation tasks such as chatbots or language translation. This process can involve a variety of techniques, including fine-tuning the model on a specific task, selecting appropriate input and output formats, and iteratively testing and refining the prompts to achieve the desired results.",
    author: 'Prompt Engineer (OpenAI)',
    timestamp: 'Yesterday, 10:20 PM',
    mine: false,
  },
  {
    content:
      'Please help me write a DAVINCI prompt to analyse the source code, which I will include in the prompt. The prompt will rewrite the code to use programming design patterns. The prompt should only return the updated code with the comments to explain the design patterns used. We do not require an overview, problems, output or any other additional information, only the source code with the comments next to each line of code. The comments should only be included if the code is complex enough to require an explanation.',
    author: 'Andrew Butson',
    timestamp: 'Yesterday, 10:25 PM',
    mine: true,
  },
  {
    content:
      "Sure, here's an example DAVINCI prompt you could use to analyze source code and rewrite it using programming design patterns:",
    author: 'Prompt Engineer (OpenAI)',
    timestamp: 'Yesterday, 10:30 PM',
    mine: false,
  },
  {
    content:
      'brilliant. We need design patterns from Gangs of Four (GoF) Design Patterns',
    author: 'Andrew Butson',
    timestamp: 'Yesterday, 10:35 PM',
    mine: true,
  },
  {
    content:
      "Sure, here's an updated example DAVINCI prompt that specifically requests the use of Gang of Four (GoF) Design Patterns:",
    author: 'Prompt Engineer (OpenAI)',
    timestamp: 'Yesterday, 10:40 PM',
    mine: false,
  },
  {
    content:
      'perfect. However, we need the code to be in the same programming language as the input source',
    author: 'Andrew Butson',
    timestamp: 'Yesterday, 10:45 PM',
    mine: true,
  },
  {
    content:
      'Certainly, here is an updated DAVINCI prompt that incorporates the requirement for the code to be written in the same programming language as the input source code:',
    author: 'Prompt Engineer (OpenAI)',
    timestamp: 'Yesterday, 10:50 PM',
    mine: false,
  },
  {
    content:
      'Again, make sure to replace <insert source code here> with the actual source code that you want to analyze and refactor, and specify the programming language used in the prompt. Also, keep in mind that the quality of the output will depend on the complexity and quality of the source code you provide, as well as the effectiveness of the design patterns used to refactor it.',
    author: 'Prompt Engineer (OpenAI)',
    timestamp: 'Yesterday, 10:50 PM',
    mine: false,
  },
]
