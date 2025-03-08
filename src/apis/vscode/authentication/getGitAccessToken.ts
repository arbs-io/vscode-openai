import { authentication } from 'vscode';

export async function getGitAccessToken(): Promise<string> {
  const gitSession = await authentication.getSession('github', ['user:email'], {
    createIfNone: true,
  });
  return gitSession.accessToken;
}
