import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, ListSubheader, Typography, useTheme } from "@mui/material";

import { PageContext } from "../../containers/app/app-hooks";

type PageDrawerListProps = {
  onItemClick: () => void;
};

const PageDrawerList = (props: PageDrawerListProps) => {
  const { onItemClick } = props;
  const { pages, currentPage, onPageChange } = useContext(PageContext);
  const theme = useTheme();

  const listItemSx = {
    "&:hover": {
      color: theme.palette.primary.light,
      opacity: 1,
    },
    "&:focus": {
      color: theme.palette.primary.main,
    },
    "&.selected": {
      color: theme.palette.primary.main,
    },
  };

  const selectedItemSx = {
    ...listItemSx,
    color: theme.palette.primary.main,
  };

  return (
    <List sx={{ width: 250 }} subheader={<Subheader />}>
      {pages.map((page) => (
        <ListItem
          sx={page === currentPage ? selectedItemSx : listItemSx}
          key={page.path}
          component={Link}
          to={page.path}
          onClick={() => {
            onPageChange(page);
            onItemClick();
          }}
          slotProps={{
            root: {
              style: { cursor: "pointer" },
            },
          }}
        >
          <ListItemText primary={page.title} />
        </ListItem>
      ))}
    </List>
  );
};

export default PageDrawerList;

const Subheader = () => {
  const theme = useTheme();
  const title = "Content";

  const subheaderSx = {
    color: theme.palette.primary.main,
    margin: "1.6rem 0%",
  };

  return (
    <ListSubheader sx={subheaderSx}>
      <Typography variant="h2">{title}</Typography>
    </ListSubheader>
  );
};
