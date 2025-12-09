import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// @description Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// @description Get initial list of public MIT-licensed repositories
app.get('/api/repos/initial', async (req, res, next) => {
  try {
    const githubRes = await fetch(
      'https://api.github.com/search/repositories?q=is:public+license:mit+fork:false&sort=updated&order=desc&per_page=20',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    if (!githubRes.ok) {
      const error = new Error('Failed to load initial repositories from Github API');
      error.status = githubRes.status;
      return next(error);
    }

    const data = await githubRes.json();

    const simplifiedRepos = data.items.map((repo) => ({
      id: repo.id,
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      owner: repo.owner?.login,
    }));

    res.json(simplifiedRepos);
  } catch (error) {
    next(error);
  }
});

// @description Get public repositories for a given owner with pagination
app.get('/api/repos/:owner', async (req, res, next) => {
  const { owner } = req.params;
  const pageNumber = Number(req.query.pageNumber) || 1;
  let pageSize = Number(req.query.pageSize) || 20;
  pageSize = Math.min(Math.max(pageSize, 1), 100);

  try {
    const githubRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(
        owner,
      )}/repos?type=public&per_page=${pageSize}&page=${pageNumber}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    if (!githubRes.ok) {
      const error = new Error(`Failed to load repositories for owner: ${owner}`);
      error.status = githubRes.status;
      return next(error);
    }

    const repos = await githubRes.json();

    const simplifiedRepos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      owner: repo.owner?.login,
    }));

    const linkHeader = githubRes.headers.get('link') || githubRes.headers.get('Link');
    let hasMore = false;

    if (linkHeader) {
      hasMore = linkHeader.includes('rel="next"');
    }

    res.json({
      pageNumber,
      pageSize,
      hasMore,
      repos: simplifiedRepos,
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  const error = new Error('Resource does not exist or is not accessible.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
