import {
  ListItem,
  ListItemText,
  Box,
  Chip,
  Link as MuiLink,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CodeIcon from "@mui/icons-material/Code";
import PersonIcon from "@mui/icons-material/Person";
import type { Repo } from "../types";

interface RepoListItemProps {
    repo: Repo;
}

const RepoListItem = ({ repo } : RepoListItemProps) => {
  return (
    <ListItem
      divider
      className="px-4 py-3"
      alignItems="flex-start"
    >
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

            <Chip
              icon={<StarIcon color="warning"/>}
              label={repo.stars}
              size="small"
            />

            {repo.language && (
              <Chip
                icon={<CodeIcon color="primary"/>}
                label={repo.language}
                size="small"
                variant="outlined"
              />
            )}

            {repo.owner && (
            <Chip
              icon={<PersonIcon color="secondary"/>}
              label={repo.owner}
              size="small"
              variant="outlined"
            />
            )}
          </Box>
        }
        secondary={repo.description || "No description provided."}
      />
    </ListItem>
  )
}

export default RepoListItem