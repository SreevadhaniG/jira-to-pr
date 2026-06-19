export interface GitHubRepository {
  owner: string;
  repo: string;
}

export function parseGitHubRepositoryUrl(
  repositoryUrl: string,
): GitHubRepository {

  const httpsMatch =
    repositoryUrl.match(
      /github\.com\/([^/]+)\/([^/.]+)(\.git)?$/,
    );

  if (httpsMatch) {
    return {
      owner: httpsMatch[1]!,
      repo: httpsMatch[2]!,
    };
  }

  const sshMatch =
    repositoryUrl.match(
      /git@github\.com:([^/]+)\/([^/.]+)(\.git)?$/,
    );

  if (sshMatch) {
    return {
      owner: sshMatch[1]!,
      repo: sshMatch[2]!,
    };
  }

  throw new Error(
    `Unsupported GitHub URL: ${repositoryUrl}`,
  );
}