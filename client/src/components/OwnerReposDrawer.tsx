import { Drawer, Box, Typography, IconButton, List, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Repo } from '../types';
import RepoListItem from './RepoListItem';

interface OwnerReposDrawerProps {
  open: boolean;
  owner: string | null;
  repos: Repo[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onClose: () => void;
  onLoadMore?: () => void;
}

const OwnerReposDrawer = ({
  open,
  owner,
  repos,
  loading,
  error,
  hasMore,
  onClose,
  onLoadMore,
}: OwnerReposDrawerProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: '40vw',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">{owner ? `Repos by ${owner}` : 'Owner Repos'}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {loading && <Typography>Loading...</Typography>}

        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && repos.length === 0 && (
          <Typography>No repositories found.</Typography>
        )}

        {repos.length > 0 && (
          <List disablePadding>
            {repos.map((repo) => {
              return <RepoListItem key={repo.id} repo={repo} isOwnerView={true} />;
            })}
          </List>
        )}

        {owner && hasMore && (
          <Box className="mt-2">
            <Button fullWidth variant="outlined" disabled={loading} onClick={onLoadMore}>
              {loading ? 'Loading...' : 'Load more'}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default OwnerReposDrawer;
