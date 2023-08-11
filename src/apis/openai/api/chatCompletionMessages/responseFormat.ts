export enum ResponseFormat {
  Markdown = '- vscode-openai response should be in markdown and always displays code as markdown in markdown fenced code block, with the language tag. For example "```xml", "```cpp" and "```go"',
  SourceCode = `- vscode-openai response must be able to compile. Only providing source code must be plain text and not markdown or markdown fenced code block. All information must be in "comment" format, for example "//" for cpp, "#" for python, ...`,
}
