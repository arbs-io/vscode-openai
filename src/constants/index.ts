export const VSCODE_OPENAI_EXTENSION = {
  INSTRUMENTATION_KEY: 'e01c0a97-9930-4885-b2e8-772176ced488',
  ENABLED_COMMAND_ID: 'vscode-openai.extension.enabled',
}

export const VSCODE_OPENAI_EMBEDDING = {
  ENABLED_COMMAND_ID: 'vscode-openai.embedding.enabled',
  SETUP_REQUIRED_COMMAND_ID: 'vscode-openai.embedding.setup-required',
  RESOURCE_QUERY_ALL: '057c0000-0000-0000-0000-000000000000',
  STORAGE_V1_ID: 'embedding.v1',
  STORAGE_V2_ID: 'embedding.v2',
}

export const VSCODE_OPENAI_CONVERSATION = {
  STORAGE_V1_ID: 'conversation',
}

export const VSCODE_OPENAI_QP_SETUP = {
  PROVIDER_VSCODE_LABEL: '$(pulse)  vscode-openai',
  PROVIDER_VSCODE_DESC: '(Sponsored) Use vscode-openai service',

  PROVIDER_OPENAI_LABEL: '$(vscode-openai)  openai.com',
  PROVIDER_OPENAI_DESC:
    '(BYOK) Use your own OpenAI subscription (api.openai.com)',

  PROVIDER_AZURE_LABEL: '$(azure)  openai.azure.com',
  PROVIDER_AZURE_DESC:
    '(BYOK) Use your own Azure OpenAI instance (instance.openai.azure.com)',

  PROVIDER_CREDAL_LABEL: '$(comment)  credal.ai',
  PROVIDER_CREDAL_DESC: '(BYOK) Use your own Credal instance (credal.ai)',

  PROVIDER_CUSTOM_LABEL: '$(server-environment)  custom',
  PROVIDER_CUSTOM_DESC:
    '(BYOI) Use your own instance LLM or SLM (openai-api support required)',

  MODEL_CHANGE_LABEL: '$(extensions)  change models',
  MODEL_CHANGE_DESC: 'change chat and embedding model',

  CONFIGURATION_RESET_LABEL: '$(workspace-untrusted)  reset...',
  CONFIGURATION_RESET_DESC: 'reset vscode-openai configuration',
}

export const VSCODE_OPENAI_QP_PERSONA = {
  CONFIGURATION_PROMPTS_LABEL: '$(tools)  Customize Prompts...',
  CONFIGURATION_PROMPTS_DESC: 'Configure the persona prompts',

  DEVELOPER_LABEL: '$(feedback)  Developer/Programmer',
  DEVELOPER_DESC:
    'Assists with design, develop, and maintain of software applications and systems',

  SYSTEM_ADMINISTRATOR_LABEL: '$(feedback)  System Administrator',
  SYSTEM_ADMINISTRATOR_DESC:
    'Assists with managing and maintain computer systems, networks, and servers',

  NETWORK_ENGINEER_LABEL: '$(feedback)  Network Engineer',
  NETWORK_ENGINEER_DESC:
    'Assists with design, implement, and maintain computer networks for organizations',

  DATABASE_ADMINISTRATOR_LABEL: '$(feedback)  Database Administrator',
  DATABASE_ADMINISTRATOR_DESC:
    'Assists with managing and maintain databases for organizations',

  IT_MANAGER_LABEL: '$(feedback)  IT Manager',
  IT_MANAGER_DESC:
    'Assists with technology infrastructure and operations of organizations',

  PROJECT_MANAGER_LABEL: '$(feedback)  Project Manager',
  PROJECT_MANAGER_DESC:
    'Assists with planning, execute, and monitor projects related to technology products and services',

  BUSINESS_ANALYSTS_LABEL: '$(feedback)  Business Analysts',
  BUSINESS_ANALYSTS_DESC:
    'Assists with analyzing business processes and requirements related to technology products and services',

  QUALITY_ASSURANCE_TESTERS_LABEL: '$(feedback)  Quality Assurance Testers',
  QUALITY_ASSURANCE_TESTERS_DESC:
    'Assists with testing software applications and systems to ensure quality control',

  TECHNICAL_WRITER_LABEL: '$(feedback)  Technical Writer',
  TECHNICAL_WRITER_DESC:
    'Assists with creating technical documentation such as user manuals, online help, and training materials',

  USER_EXPERIENCE_DESIGNERS_LABEL: '$(feedback)  User Experience Designers',
  USER_EXPERIENCE_DESIGNERS_DESC:
    'Assists with designing and improve the user experience of software applications and systems',

  PRODUCT_MANAGER_LABEL: '$(feedback)  Product Manager',
  PRODUCT_MANAGER_DESC:
    'Assists with overseeing the development and launch of software products and services',

  DATA_SCIENTIST_LABEL: '$(feedback)  Data Scientist',
  DATA_SCIENTIST_DESC:
    'Assists with analyzing and interpret complex data sets to identify patterns and insights',

  CYBER_SECURITY_ANALYSTS_LABEL: '$(feedback)  Cyber Security Analysts',
  CYBER_SECURITY_ANALYSTS_DESC:
    'Assists with protecting computer systems and networks from cyber attacks and security breaches',

  CLOUD_ARCHITECT_LABEL: '$(feedback)  Cloud Architect',
  CLOUD_ARCHITECT_DESC:
    'Assists with designing and implement cloud computing solutions for organizations',

  DEVOPS_ENGINEERS_LABEL: '$(feedback)  DevOps Engineers',
  DEVOPS_ENGINEERS_DESC:
    'Assists with bridging the gap between development and operations teams by automating software delivery processes',

  ENTERPRISE_ARCHITECT_LABEL: '$(feedback)  Enterprise Architect',
  ENTERPRISE_ARCHITECT_DESC:
    'Assists with designing and oversee the implementation of technology solutions that align with business goals and objectives',
}
