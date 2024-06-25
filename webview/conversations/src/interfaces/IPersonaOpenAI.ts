interface IPrompt {
  system: string
}

interface IConfiguration {
  model: string
  service: string
}

export interface IPersonaOpenAI {
  roleId: string
  roleName: string
  configuration: IConfiguration
  prompt: IPrompt
}
