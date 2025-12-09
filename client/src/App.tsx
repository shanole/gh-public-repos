import { useEffect, useState, useCallback } from 'react';
import { Container, List, Typography } from '@mui/material';
import type { Repo } from './types';
import { fetchInitialRepos, fetchReposByOwner } from './api';
import RepoListItem from './components/RepoListItem';
import OwnerReposDrawer from './components/OwnerReposDrawer';
import RepoToolbar from './components/RepoToolbar';

const INITIAL_PAGE_NUMBER = 1;
const PAGE_SIZE = 20;

const App = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [originalRepos, setOriginalRepos] = useState<Repo[]>([]);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ownerReposState, setOwnerReposState] = useState({
    repos: [] as Repo[],
    pageNumber: INITIAL_PAGE_NUMBER,
    hasMore: false,
    loading: false,
    error: null as string | null,
    owner: null as string | null,
  });

  const visibleRepos =
    selectedLanguages.length === 0
      ? repos
      : repos.filter((repo) => repo.language && selectedLanguages.includes(repo.language));

  useEffect(() => {
    const loadInitialRepos = async () => {
      try {
        const initialRepos = await fetchInitialRepos();
        setRepos(initialRepos);
        setOriginalRepos(initialRepos);
      } catch (error) {
        console.error('Failed to load initial repositories:', error);
        setError('Failed to load initial repositories');
      } finally {
        setLoading(false);
      }
    };

    loadInitialRepos();
  }, []);

  const sortReposAscending = () => {
    setRepos((prevRepos) => [...prevRepos].sort((a, b) => a.stars - b.stars));
  };

  const sortReposDescending = () => {
    setRepos((prevRepos) => [...prevRepos].sort((a, b) => b.stars - a.stars));
  };

  const resetSort = () => {
    setRepos(originalRepos);
    setSelectedLanguages([]);
  };

  const loadOwnerRepos = async (owner: string, pageNumber: number) => {
    try {
      setOwnerReposState((prevState) => ({ ...prevState, loading: true, error: null }));

      const data = await fetchReposByOwner(owner, pageNumber, PAGE_SIZE);
      setOwnerReposState((prevState) => ({
        ...prevState,
        repos: pageNumber === 1 ? data.repos : [...prevState.repos, ...data.repos],
        pageNumber: data.pageNumber,
        hasMore: data.hasMore,
        owner,
      }));
    } catch (error) {
      console.error('Failed to load owner repos:', error);
      const message = error instanceof Error ? error.message : `Failed to load repos for ${owner}`;
      setOwnerReposState((prevState) => ({ ...prevState, error: message }));
    } finally {
      setOwnerReposState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleShowOwnerRepos = useCallback((owner: string) => {
    setDrawerOpen(true);
    setOwnerReposState({
      repos: [],
      pageNumber: INITIAL_PAGE_NUMBER,
      hasMore: false,
      loading: false,
      error: null,
      owner,
    });

    void loadOwnerRepos(owner, 1);
  }, []);

  const handleLoadMoreOwnerRepos = () => {
    if (!ownerReposState.owner) return;
    const nextPage = ownerReposState.pageNumber + 1;
    void loadOwnerRepos(ownerReposState.owner, nextPage);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h3">GitHub Public Repos</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Showing 20 public MIT-licensed repositories from GitHub.
        </Typography>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && repos?.length === 0 && (
          <Typography>No repositories found.</Typography>
        )}

        {!loading && !error && repos?.length > 0 && (
          <>
            <RepoToolbar
              repos={repos}
              visibleRepos={visibleRepos}
              selectedLanguages={selectedLanguages}
              onLanguageChange={setSelectedLanguages}
              onSortAscending={sortReposAscending}
              onSortDescending={sortReposDescending}
              onReset={resetSort}
            />

            <List>
              {visibleRepos.map((repo) => {
                return (
                  <RepoListItem key={repo.id} repo={repo} onShowOwnerRepos={handleShowOwnerRepos} />
                );
              })}
            </List>
          </>
        )}

        <OwnerReposDrawer
          open={drawerOpen}
          owner={ownerReposState.owner}
          repos={ownerReposState.repos}
          loading={ownerReposState.loading}
          error={ownerReposState.error}
          hasMore={ownerReposState.hasMore}
          onClose={() => setDrawerOpen(false)}
          onLoadMore={handleLoadMoreOwnerRepos}
        />
      </Container>
    </div>
  );
};

export default App;
