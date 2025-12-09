import { useEffect, useState } from 'react';
import { Button, Container, List, Menu, MenuItem, Typography } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import type { Repo } from './types';
import { fetchInitialRepos, fetchReposByOwner } from './api';
import RepoListItem from './components/RepoListItem';
import OwnerReposDrawer from './components/OwnerReposDrawer';

const App = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [ownerRepos, setOwnerRepos] = useState<Repo[]>([]);
  const [ownerPageNumber, setOwnerPageNumber] = useState(1);
  const [ownerHasMore, setOwnerHasMore] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialRepos = async () => {
      try {
        const initialRepos = await fetchInitialRepos();
        setRepos(initialRepos);
      } catch (error) {
        console.error('Failed to load initial repositories:', error);
        setError('Failed to load initial repositories');
      } finally {
        setLoading(false);
      }
    };

    loadInitialRepos();
  }, []);

  const openSortMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchor(event.currentTarget);
  };

  const closeSortMenu = () => {
    setSortAnchor(null);
  };

  const sortReposAscending = () => {
    setRepos([...repos].sort((a, b) => a.stars - b.stars));
    closeSortMenu();
  };

  const sortReposDescending = () => {
    setRepos([...repos].sort((a, b) => b.stars - a.stars));
    closeSortMenu();
  };

  const loadOwnerRepos = async (owner: string, pageNumber: number) => {
    try {
      setOwnerLoading(true);
      setOwnerError(null);

      const data = await fetchReposByOwner(owner, pageNumber, 20);
      setOwnerRepos((prevRepos) => (pageNumber === 1 ? data.repos : [...prevRepos, ...data.repos]));
      setOwnerPageNumber(data.pageNumber);
      setOwnerHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load owner repos:', error);
      const message = error instanceof Error ? error.message : `Failed to load repos for ${owner}`;
      setOwnerError(message);
    } finally {
      setOwnerLoading(false);
    }
  };

  const handleShowOwnerRepos = (owner: string) => {
    setSelectedOwner(owner);
    setDrawerOpen(true);
    setOwnerRepos([]);
    setOwnerPageNumber(1);
    setOwnerHasMore(false);
    setOwnerError(null);

    void loadOwnerRepos(owner, 1);
  };

  const handleLoadMoreOwnerRepos = () => {
    if (!selectedOwner) return;
    const nextPage = ownerPageNumber + 1;
    void loadOwnerRepos(selectedOwner, nextPage);
  };

  return (
    <>
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
              <div className="flex my-2">
                <Button variant="outlined" startIcon={<SortIcon />} onClick={openSortMenu}>
                  Sort by stars
                </Button>
              </div>
              <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={closeSortMenu}>
                <MenuItem onClick={sortReposAscending}>Stars: Low → High</MenuItem>
                <MenuItem onClick={sortReposDescending}>Stars: High → Low</MenuItem>
              </Menu>
              <List>
                {repos.map((repo) => {
                  return (
                    <RepoListItem
                      key={repo.id}
                      repo={repo}
                      onShowOwnerRepos={handleShowOwnerRepos}
                    />
                  );
                })}
              </List>
            </>
          )}

          <OwnerReposDrawer
            open={drawerOpen}
            owner={selectedOwner}
            repos={ownerRepos}
            loading={ownerLoading}
            error={ownerError}
            hasMore={ownerHasMore}
            onClose={() => setDrawerOpen(false)}
            onLoadMore={handleLoadMoreOwnerRepos}
          />
        </Container>
      </div>
    </>
  );
};

export default App;
