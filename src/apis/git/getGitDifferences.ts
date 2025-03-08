import { GitService } from '.';

// This function retrieves the git differences for the selected repository and returns them as a string.
// It takes a GitService object as input and returns a Promise that resolves to a string or undefined.
export const getGitDifferences = async (
  git: GitService
): Promise<string | undefined> => {
  const repo = git.getSelectedRepository();
  let diff = await repo?.diff(true);
  if (!diff) {diff = await repo?.diff(false);}
  return diff;
};
