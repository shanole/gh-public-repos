import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { Repo } from './types';
import { fetchInitialRepos, fetchReposByOwner } from './api';

vi.mock('./api', () => ({
  fetchInitialRepos: vi.fn(),
  fetchReposByOwner: vi.fn(),
}));

const mockFetchInitialRepos = vi.mocked(fetchInitialRepos);
const mockFetchReposByOwner = vi.mocked(fetchReposByOwner);

const makeRepo = (overrides: Partial<Repo> = {}): Repo => ({
  id: 1,
  name: 'repo 1',
  url: 'https://github.com/repo-1',
  description: 'test repo 1',
  stars: 100,
  language: 'TypeScript',
  owner: 'owner1',
  ...overrides,
});

describe('Integration - App component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders', async () => {
    render(<App />);

    const heading = await screen.findByText('GitHub Public Repos');
    expect(heading).toBeInTheDocument();
  });

  it('renders initial repos', async () => {
    const repos: Repo[] = [
      makeRepo({ id: 1, name: 'repo 1', stars: 50 }),
      makeRepo({ id: 2, name: 'repo 2', stars: 150 }),
    ];

    mockFetchInitialRepos.mockResolvedValueOnce(repos);

    render(<App />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('repo 1')).toBeInTheDocument();
    expect(await screen.findByText('repo 2')).toBeInTheDocument();
    expect(screen.queryByText('Failed to load initial repositories')).not.toBeInTheDocument();
  });

  it('shows an error message when initial repos fail to load', async () => {
    mockFetchInitialRepos.mockRejectedValueOnce(new Error('Error'));

    render(<App />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('Failed to load initial repositories')).toBeInTheDocument();
  });

  it('shows no repos message when initial repos are empty', async () => {
    mockFetchInitialRepos.mockResolvedValueOnce([]);

    render(<App />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('No repositories found.')).toBeInTheDocument();
  });

  it('allows for sorting repos by stars in ascending and escending order', async () => {
    const repos: Repo[] = [
      makeRepo({ id: 1, name: 'low stars', stars: 1 }),
      makeRepo({ id: 2, name: 'mid stars', stars: 50 }),
      makeRepo({ id: 3, name: 'high stars', stars: 100 }),
    ];

    mockFetchInitialRepos.mockResolvedValueOnce(repos);

    render(<App />);

    await screen.findByText('low stars');

    const sortButton = screen.getByRole('button', { name: 'Sort by stars' });

    // Sort descending
    await userEvent.click(sortButton);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Stars: High → Low' }));

    let repoItems = screen.getAllByRole('link');
    let sortedReposNames = repoItems.map((item) => item.textContent);
    expect(sortedReposNames).toEqual(['high stars', 'mid stars', 'low stars']);

    // Sort ascending
    await userEvent.click(sortButton);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Stars: Low → High' }));

    repoItems = screen.getAllByRole('link');
    sortedReposNames = repoItems.map((item) => item.textContent);
    expect(sortedReposNames).toEqual(['low stars', 'mid stars', 'high stars']);
  });

  it('shows owner repos in drawer when clicking owner chip', async () => {
    const initialRepos: Repo[] = [makeRepo({ id: 1, name: 'repo 1', owner: 'owner1' })];
    mockFetchInitialRepos.mockResolvedValueOnce(initialRepos);

    const ownerReposPageOne: Repo[] = [makeRepo({ id: 2, name: 'owner1 repo 1', owner: 'owner1' })];

    const ownerReposPageTwo: Repo[] = [makeRepo({ id: 3, name: 'owner1 repo 2', owner: 'owner1' })];

    mockFetchReposByOwner.mockResolvedValueOnce({
      pageNumber: 1,
      pageSize: 20,
      count: ownerReposPageOne.length,
      hasMore: true,
      repos: ownerReposPageOne,
    });

    mockFetchReposByOwner.mockResolvedValueOnce({
      pageNumber: 1,
      pageSize: 20,
      count: ownerReposPageTwo.length,
      hasMore: false,
      repos: ownerReposPageTwo,
    });

    render(<App />);

    await screen.findByText('repo 1');

    const ownerChip = screen.getByRole('button', { name: 'owner1' });
    await userEvent.click(ownerChip);

    // First page of owner repos
    expect(await screen.findByText('Repos by owner1')).toBeInTheDocument();
    expect(await screen.findByText('owner1 repo 1')).toBeInTheDocument();

    // Load more owner repos
    const loadMoreButton = screen.getByRole('button', { name: 'Load more' });
    await userEvent.click(loadMoreButton);
    expect(await screen.findByText('owner1 repo 2')).toBeInTheDocument();
  });

  it('shows error message in drawer when owner repos fail to load', async () => {
    const initialRepos: Repo[] = [makeRepo({ id: 1, name: 'repo 1', owner: 'owner1' })];
    mockFetchInitialRepos.mockResolvedValueOnce(initialRepos);

    mockFetchReposByOwner.mockRejectedValueOnce(new Error('Owner repo error'));

    render(<App />);

    await screen.findByText('repo 1');
    const ownerChip = screen.getByRole('button', { name: 'owner1' });
    await userEvent.click(ownerChip);

    expect(await screen.findByText('Owner repo error')).toBeInTheDocument();
  });

  it('shows no repos message in drawer when owner has no repos', async () => {
    const initialRepos: Repo[] = [makeRepo({ id: 1, name: 'repo 1', owner: 'owner1' })];
    mockFetchInitialRepos.mockResolvedValueOnce(initialRepos);

    mockFetchReposByOwner.mockResolvedValueOnce({
      pageNumber: 1,
      pageSize: 20,
      count: 0,
      hasMore: false,
      repos: [],
    });

    render(<App />);

    await screen.findByText('repo 1');
    const ownerChip = screen.getByRole('button', { name: 'owner1' });
    await userEvent.click(ownerChip);

    expect(await screen.findByText('No repositories found.')).toBeInTheDocument();
  });
});
