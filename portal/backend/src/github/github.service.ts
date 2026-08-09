import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

export interface PullRequestParams {
  branchName: string;
  title: string;
  body: string;
  files: Map<string, string>;
  author: { name: string; email: string; github: string };
}

@Injectable()
export class GithubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private baseBranch: string;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    this.owner = process.env.GITHUB_OWNER || 'your-org';
    this.repo = process.env.GITHUB_REPO || 'design-system';
    this.baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';
  }

  async createPullRequest(params: PullRequestParams): Promise<string> {
    const { branchName, title, body, files } = params;

    // 1. Get the SHA of the base branch
    const { data: ref } = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.baseBranch}`,
    });
    const baseSha = ref.object.sha;

    // 2. Create a new branch
    await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });

    // 3. Create blobs for each file
    const blobs = await Promise.all(
      Array.from(files.entries()).map(async ([path, content]) => {
        const { data } = await this.octokit.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: Buffer.from(content).toString('base64'),
          encoding: 'base64',
        });
        return { path, sha: data.sha };
      }),
    );

    // 4. Create a tree with all the files
    const { data: baseCommit } = await this.octokit.git.getCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: baseSha,
    });

    const { data: tree } = await this.octokit.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: baseCommit.tree.sha,
      tree: blobs.map((blob) => ({
        path: blob.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      })),
    });

    // 5. Create a commit
    const { data: commit } = await this.octokit.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: title,
      tree: tree.sha,
      parents: [baseSha],
      author: {
        name: params.author.name,
        email: params.author.email,
        date: new Date().toISOString(),
      },
    });

    // 6. Update the branch reference
    await this.octokit.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branchName}`,
      sha: commit.sha,
    });

    // 7. Create the pull request
    const { data: pr } = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      head: branchName,
      base: this.baseBranch,
    });

    // 8. Add labels
    await this.octokit.issues.addLabels({
      owner: this.owner,
      repo: this.repo,
      issue_number: pr.number,
      labels: ['community', 'component', 'auto-generated'],
    });

    return pr.html_url;
  }

  async fileExists(path: string): Promise<boolean> {
    try {
      await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.baseBranch,
      });
      return true;
    } catch {
      return false;
    }
  }
}
