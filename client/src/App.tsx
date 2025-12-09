import { useEffect, useState } from "react";
import { Container, List, Typography } from "@mui/material"
import type { Repo } from "./types";
import { fetchInitialRepos } from "./api";
import RepoListItem from "./components/RepoListItem";

const App = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
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
        <List>
          {repos.map((repo) => {
            return (<RepoListItem key={repo.id} repo={repo} />)
          })}
        </List>
      </Container>
    </div>
    </>
  )
}

export default App
