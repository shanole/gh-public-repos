import { useState, useMemo } from 'react';
import {
  Button,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  OutlinedInput,
  Select,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import type { Repo } from '../types';

interface RepoToolbarProps {
  repos: Repo[];
  visibleRepos: Repo[];
  selectedLanguages: string[];
  onLanguageChange: (languages: string[]) => void;
  onSortAscending: () => void;
  onSortDescending: () => void;
  onReset: () => void;
}

const RepoToolbar = ({
  repos,
  visibleRepos,
  selectedLanguages,
  onLanguageChange,
  onSortAscending,
  onSortDescending,
  onReset,
}: RepoToolbarProps) => {
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  const languages = useMemo(
    () => Array.from(new Set(repos?.map((repo) => repo.language).filter(Boolean) as string[])),
    [repos],
  );

  const openSortMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchor(event.currentTarget);
  };

  const closeSortMenu = () => {
    setSortAnchor(null);
  };

  const handleSortAscending = () => {
    onSortAscending();
    closeSortMenu();
  };

  const handleSortDescending = () => {
    onSortDescending();
    closeSortMenu();
  };

  return (
    <Box className="flex flex-wrap items-center justify-between my-2 gap-2">
      <Typography variant="body2" color="textSecondary">
        {visibleRepos?.length} of {repos?.length} repositories
      </Typography>

      <Box className="flex flex-wrap items-center gap-2">
        {/* Language filter */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="language-filter-label">Filter by language</InputLabel>
          <Select
            labelId="language-filter-label"
            multiple
            value={selectedLanguages}
            onChange={(event) => {
              const value = event.target.value as string[];
              onLanguageChange(value);
            }}
            input={<OutlinedInput label="Filter by language" />}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                <Checkbox checked={selectedLanguages.indexOf(lang) > -1} />
                <ListItemText primary={lang} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort by stars */}
        <Button
          variant="outlined"
          startIcon={<SortIcon />}
          onClick={openSortMenu}
          disabled={visibleRepos?.length === 0}
        >
          Sort by stars
        </Button>
        <Button onClick={onReset}>Reset</Button>

        <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={closeSortMenu}>
          <MenuItem onClick={handleSortAscending}>Stars: Low → High</MenuItem>
          <MenuItem onClick={handleSortDescending}>Stars: High → Low</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default RepoToolbar;
