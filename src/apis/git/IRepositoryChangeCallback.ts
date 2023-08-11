export type IRepositoryChangeCallback = (repositoryInfo: {
  numberOfRepositories: number
  selectedRepositoryPath: string
  availableRepositories: string[]
}) => void