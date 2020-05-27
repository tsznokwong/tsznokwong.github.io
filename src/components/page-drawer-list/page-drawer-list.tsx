import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  Theme,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

import { PageContext } from "../../containers/app/app-hooks";

type PageDrawerListProps = {
  onItemClick: () => void;
};

const PageDrawerList = (props: PageDrawerListProps) => {
  const { onItemClick } = props;
  const { pages, currentPage, onPageChange } = useContext(PageContext);
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {pages.map((page) => (
        <ListItem
          className={classes.listItem}
          button
          key={page.path}
          selected={page === currentPage}
          component={Link}
          to={page.path}
          onClick={() => {
            onPageChange(page);
            onItemClick();
          }}
        >
          <ListItemText primary={page.title} />
        </ListItem>
      ))}
    </List>
  );
};

export default PageDrawerList;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 250,
  },
  listItem: {
    "&:hover": {
      color: theme.palette.primary.light,
      opacity: 1,
    },
    "&$selected": {
      color: theme.palette.primary.main,
    },
    "&:focus": {
      color: theme.palette.primary.main,
    },
  },
}));
