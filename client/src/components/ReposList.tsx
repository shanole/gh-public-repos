import { memo } from 'react';
import { Box, Button, List, Typography } from '@mui/material';
import RepoListItem from './RepoListItem';
import type { Repo } from '../types';

interface ReposListProps {
  repos: Repo[];
  isOwnerView?: boolean;
  showOwnerRepos?: (owner: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loading?: boolean;
}

const ReposList = ({
  repos,
  isOwnerView = false,
  showOwnerRepos,
  hasMore = false,
  onLoadMore,
  loading = false,
}: ReposListProps) => {
  if (repos?.length === 0 && !loading) {
    return <Typography>No repositories found.</Typography>;
  }
  return (
    <List>
      {repos?.map((repo) => (
        <RepoListItem
          key={repo.id}
          repo={repo}
          isOwnerView={isOwnerView}
          onShowOwnerRepos={showOwnerRepos}
        />
      ))}
      {hasMore && onLoadMore && (
        <Box className="mt-2">
          <Button fullWidth variant="outlined" disabled={loading} onClick={onLoadMore}>
            {loading ? 'Loading...' : 'Load more'}
          </Button>
        </Box>
      )}
    </List>
  );
};

export default memo(ReposList);
