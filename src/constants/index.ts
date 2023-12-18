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
  CONFIGURATION: 'Customize Prompts...',
  CONFIGURATION_ICON: 'tools',
  CONFIGURATION_DESC: 'Configure the persona prompts',

  DEVELOPER: 'Developer/Programmer',
  DEVELOPER_ICON: 'debug-console',
  DEVELOPER_DESC:
    'Assists with design, develop, and maintain of software applications and systems',

  SYSTEM_ADMIN: 'System Administrator',
  SYSTEM_ADMIN_ICON: 'console',
  SYSTEM_ADMIN_DESC:
    'Assists with managing and maintain computer systems, networks, and servers',

  NETWORK_ENGINEER: 'Network Engineer',
  NETWORK_ENGINEER_ICON: 'type-hierarchy',
  NETWORK_ENGINEER_DESC:
    'Assists with design, implement, and maintain computer networks for organizations',

  DATABASE_ADMIN: 'Database Administrator',
  DATABASE_ADMIN_ICON: 'database',
  DATABASE_ADMIN_DESC:
    'Assists with managing and maintain databases for organizations',

  IT_MANAGER: 'IT Manager',
  IT_MANAGER_ICON: 'coffee',
  IT_MANAGER_DESC:
    'Assists with technology infrastructure and operations of organizations',

  PROJECT_MANAGER: 'Project Manager',
  PROJECT_MANAGER_ICON: 'account',
  PROJECT_MANAGER_DESC:
    'Assists with planning, execute, and monitor projects related to technology products and services',

  BUSINESS_ANALYST: 'Business Analysts',
  BUSINESS_ANALYST_ICON: 'telescope',
  BUSINESS_ANALYST_DESC:
    'Assists with analyzing business processes and requirements related to technology products and services',

  QA_TESTER: 'Quality Assurance Testers',
  QA_TESTER_ICON: 'bug',
  QA_TESTER_DESC:
    'Assists with testing software applications and systems to ensure quality control',

  TECHNICAL_WRITER: 'Technical Writer',
  TECHNICAL_WRITER_ICON: 'word-wrap',
  TECHNICAL_WRITER_DESC:
    'Assists with creating technical documentation such as user manuals, online help, and training materials',

  USER_EXPERIENCE: 'User Experience Designers',
  USER_EXPERIENCE_ICON: 'tag',
  USER_EXPERIENCE_DESC:
    'Assists with designing and improve the user experience of software applications and systems',

  PRODUCT_MANAGER: 'Product Manager',
  PRODUCT_MANAGER_ICON: 'folder-active',
  PRODUCT_MANAGER_DESC:
    'Assists with overseeing the development and launch of software products and services',

  DATA_SCIENTIST: 'Data Scientist',
  DATA_SCIENTIST_ICON: 'combine',
  DATA_SCIENTIST_DESC:
    'Assists with analyzing and interpret complex data sets to identify patterns and insights',

  CYBER_SECURITY: 'Cyber Security Analysts',
  CYBER_SECURITY_ICON: 'workspace-trusted',
  CYBER_SECURITY_DESC:
    'Assists with protecting computer systems and networks from cyber attacks and security breaches',

  CLOUD_ARCHITECT: 'Cloud Architect',
  CLOUD_ARCHITECT_ICON: 'cloud',
  CLOUD_ARCHITECT_DESC:
    'Assists with designing and implement cloud computing solutions for organizations',

  DEVOPS_ENGINEERS: 'DevOps Engineers',
  DEVOPS_ENGINEERS_ICON: 'circuit-board',
  DEVOPS_ENGINEERS_DESC:
    'Assists with bridging the gap between development and operations teams by automating software delivery processes',

  ENTERPRISE_ARCHITECT: 'Enterprise Architect',
  ENTERPRISE_ARCHITECT_ICON: 'organization',
  ENTERPRISE_ARCHITECT_DESC:
    'Assists with designing and oversee the implementation of technology solutions that align with business goals and objectives',
}
