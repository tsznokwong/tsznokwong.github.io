import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  Theme,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
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
    <List className={classes.root} subheader={<Subheader />}>
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
  subheader: {
    color: theme.palette.primary.main,
    margin: "1.6rem 0%",
  },
}));

const Subheader = () => {
  const classes = useStyles();
  const title = "Content";
  return (
    <ListSubheader className={classes.subheader}>
      <Typography variant="h2">{title}</Typography>
    </ListSubheader>
  );
};
