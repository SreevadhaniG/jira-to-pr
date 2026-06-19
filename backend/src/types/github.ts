export interface PullRequestContext {
  owner: string;
  repo: string;
  head: string;
  base: string;
  title: string;
  description: string;
}