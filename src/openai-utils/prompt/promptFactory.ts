// Define a factory interface for creating prompts
export interface PromptFactory {
  createPrompt(): () => Promise<string>
}
