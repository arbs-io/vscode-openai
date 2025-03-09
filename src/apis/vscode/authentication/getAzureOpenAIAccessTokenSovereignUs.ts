import { authentication } from 'vscode';

export async function getAzureOpenAIAccessTokenSovereignUs(): Promise<string> {
  const msSession = await authentication.getSession(
    'microsoft-sovereign-cloud',
    ['https://cognitiveservices.azure.us/.default', 'offline_access'],
    { createIfNone: true }
  );
  return msSession.accessToken;
}
