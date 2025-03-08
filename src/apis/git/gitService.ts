import { Disposable, Extension, extensions } from 'vscode';
import { IRepositoryChangeCallback } from '.';
import { GitExtension, API, Repository } from '@app/types/git';

class GitService {
  private isGitAvailable = false;
  private gitExtension: Extension<GitExtension> | undefined;
  private api: API | undefined;
  private disposables: Disposable[] = [];

  constructor() {
    this.gitExtension = extensions.getExtension('vscode.git');

    if (!this.gitExtension) {
      return;
    }

    this.isGitAvailable = true;
    this.api = this.gitExtension.exports.getAPI(1);
  }

  public getSelectedRepository(): Repository | undefined {
    const selected = this.api?.repositories.find(
      (repo: Repository) => repo.ui.selected
    );

    if (selected) {
      return selected;
    }

    return this.api?.repositories[0];
  }

  private getRepositoryByPath(path: string): Repository | undefined {
    const repository = this.api?.repositories.find(
      (r: Repository) => r.rootUri.path === path
    );

    if (repository) {return repository;}
    return undefined;
  }

  public onRepositoryDidChange(handler: IRepositoryChangeCallback) {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];

    this.api?.repositories.forEach((repo) => {
      this.disposables.push(
        repo.ui.onDidChange(() => {
          if (repo.ui.selected) {
            handler({
              numberOfRepositories: this.getNumberOfRepositories(),
              selectedRepositoryPath: repo.rootUri.path,
              availableRepositories: this.getAvailableRepositoryPaths(),
            });
          }
        }, this)
      );
    });
  }

  public getNumberOfRepositories() {
    return this.api?.repositories.length ?? 0;
  }

  public getAvailableRepositoryPaths(): string[] {
    if (!this.api?.repositories) {
      return [];
    }

    return this.api?.repositories.map((r) => r.rootUri.path);
  }

  public getSelectedRepositoryPath() {
    const repo = this.getSelectedRepository();

    return repo?.rootUri.path;
  }

  public isAvailable(): boolean {
    return this.isGitAvailable;
  }

  public getSCMInputBoxMessage(): string {
    const repo = this.getSelectedRepository();

    if (repo) {
      return repo.inputBox.value;
    }

    return '';
  }

  public setSCMInputBoxMessage(message: string, repositoryPath = ''): void {
    let repo: Repository | undefined;

    if (repositoryPath !== '') {
      repo = this.getRepositoryByPath(repositoryPath);
    }

    if (!repo) {
      repo = this.getSelectedRepository();
    }

    if (repo) {
      repo.inputBox.value = message;
    }
  }

  public async getRepositoryRecentCommitMessages(
    repository: Repository,
    limit = 32
  ) {
    const log = await repository.log({ maxEntries: limit });

    if (!log) {
      return [];
    }

    return log;
  }

  public async getRecentCommitMessages(limit = 32) {
    const repo = this.getSelectedRepository();

    if (!repo) {
      return [];
    }

    return this.getRepositoryRecentCommitMessages(repo, limit);
  }

  public async getRecentCommitMessagesByPath(path: string, limit = 32) {
    const repo = this.getRepositoryByPath(path);

    if (!repo) {
      return [];
    }

    return this.getRepositoryRecentCommitMessages(repo, limit);
  }
}

export default GitService;
