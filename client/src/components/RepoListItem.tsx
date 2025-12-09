import { memo } from 'react';
import { ListItem, ListItemText, Box, Chip, Link as MuiLink, Tooltip, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import type { Repo } from '../types';

interface RepoListItemProps {
  repo: Repo;
  onShowOwnerRepos?: (owner: string) => void;
  isOwnerView?: boolean;
}

const RepoListItem = ({ repo, onShowOwnerRepos, isOwnerView = false }: RepoListItemProps) => {
  const handleClickShowOwner = () => {
    if (onShowOwnerRepos) {
      onShowOwnerRepos(repo.owner);
    }
  };
  return (
    <ListItem divider className="px-4 py-3" alignItems="flex-start">
      <ListItemText
        primary={
          <Box className="flex flex-wrap items-center gap-2">
            <MuiLink
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              variant="h6"
            >
              {repo.name}
            </MuiLink>

            <Chip icon={<StarIcon color="warning" />} label={repo.stars} size="small" />

            {repo.language && (
              <Chip
                icon={<CodeIcon color="primary" />}
                label={repo.language}
                size="small"
                variant="outlined"
              />
            )}
            {!isOwnerView && (
              <Tooltip title="Show All Author Repos" placement="right">
                <Chip
                  icon={<PersonIcon color="secondary" />}
                  label={repo.owner}
                  size="small"
                  variant="outlined"
                  onClick={handleClickShowOwner}
                />
              </Tooltip>
            )}
          </Box>
        }
        secondary={
          <Box className="flex flex-col">
            <span>{repo.description || ''}</span>
            {!isOwnerView && (
              <Button
                size="small"
                startIcon={<PersonIcon />}
                onClick={handleClickShowOwner}
                color="secondary"
                sx={{ width: 'fit-content', padding: 0 }}
              >
                Show all author repos
              </Button>
            )}
          </Box>
        }
        slotProps={{ secondary: { component: 'div' } }}
      />
    </ListItem>
  );
};

export default memo(RepoListItem);
