import { useEffect, useState } from "react";
import { Button, Container, List, Menu, MenuItem, Typography, Drawer, Box, IconButton } from "@mui/material"
import type { Repo } from "./types";
import { fetchInitialRepos } from "./api";
import RepoListItem from "./components/RepoListItem";
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from "@mui/icons-material/Close";

const App = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInitialRepos = async () => {
      try {
        const initialRepos = await fetchInitialRepos();
        setRepos(initialRepos);
      } catch (error) {
        console.error("Failed to load initial repositories:", error);
        setError("Failed to load initial repositories");
      } finally {
        setLoading(false);
      }
    };

    loadInitialRepos();
  }, []);

  const openSortMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchor(event.currentTarget);
  };

  const closeSortMenu = () => { setSortAnchor(null)};

  const sortReposAscending = () => {
    setRepos([...repos].sort((a, b) => a.stars - b.stars)); 
    closeSortMenu();
  };

  const sortReposDescending = () => {
    setRepos([...repos].sort((a, b) => b.stars - a.stars)); 
    closeSortMenu();
  };

  const handleShowOwnerRepos = (owner: string) => {
    console.log("Show repos for owner:", owner);
    setSelectedOwner(owner);
    setDrawerOpen(true);
  };

  return (
    <>
    <div className="min-h-screen bg-slate-50">
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h3">GitHub Public Repos</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Showing 20 public MIT-licensed repositories
          from GitHub.
        </Typography>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && repos.length === 0 && (
          <Typography>No repositories found.</Typography>
        )}
        {!loading && !error && repos.length > 0 && (
          <>
          <div className="flex my-2">
            <Button
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={openSortMenu}
            >
              Sort By Stars
            </Button>
          </div>

          <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={closeSortMenu}>
            <MenuItem onClick={sortReposAscending}>Stars: Low → High</MenuItem>
            <MenuItem onClick={sortReposDescending}>Stars: High → Low</MenuItem>
          </Menu>
          <List>
            {repos.map((repo) => {
              return (<RepoListItem key={repo.id} repo={repo} onShowOwnerRepos={handleShowOwnerRepos} />)
            })}
          </List>
          </>
        )}

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{
              width: "40vw",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6">
                {selectedOwner ? `Repos by ${selectedOwner}` : "Author Repos"}
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {`This drawer will show ${selectedOwner}'s repositories.`}
            </Typography>
          </Box>
        </Drawer>
      </Container>
    </div>
    </>
  )
}

export default App
