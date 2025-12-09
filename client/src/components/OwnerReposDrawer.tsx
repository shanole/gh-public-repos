import { Drawer, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Repo } from '../types';
import ReposList from './ReposList';

interface OwnerReposDrawerProps {
  open: boolean;
  owner: string | null;
  repos: Repo[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onClose: () => void;
  onLoadMore: () => void;
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
  const isInitialLoading = loading && repos?.length === 0;
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

        {isInitialLoading || error ? (
          <Typography color={error ? 'error' : 'textSecondary'}>
            {error ? error : 'Loading...'}
          </Typography>
        ) : (
          <ReposList
            repos={repos}
            isOwnerView={true}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            loading={loading}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default OwnerReposDrawer;
