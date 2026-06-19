import { Octokit } from "octokit";

const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error(
    "GITHUB_TOKEN is not configured",
  );
}

export const github =
  new Octokit({
    auth: token,
  });