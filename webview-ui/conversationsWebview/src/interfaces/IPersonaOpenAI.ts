export interface IPrompt {
  system: string
}

export interface IConfiguration {
  model: string
  service: string
}

export interface IPersonaOpenAI {
  roleId: string
  roleName: string
  configuration: IConfiguration
  prompt: IPrompt
}
