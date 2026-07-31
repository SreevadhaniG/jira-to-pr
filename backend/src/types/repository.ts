export interface RepositoryContext {
  repositoryUrl: string;
  repositoryPath: string;
  exists: boolean;
}

export interface RepositoryFile {
  name: string;
  relativePath: string;
  requiredChanges: string;
  exists: boolean;
  content: string;
}

export interface RepositoryMetadata {
    directoryTree: string;
    configurationFiles: RepositoryFile[];
    documentationFiles: RepositoryFile[];
}