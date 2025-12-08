import React from "react";
import { Theme, IconButton } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import Tooltip from "../../tooltip";
import { LinkMeta } from "../../../types/social-link-type";

type SocialLinkProps = {
  socialLink: LinkMeta;
};

const SocialLink = (props: SocialLinkProps) => {
  const { Icon, link, title } = props.socialLink;
  const classes = useStyles();
  return (
    <Tooltip title={title} placement="top">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <IconButton className={classes.root} disableRipple size="large">
          <Icon color="primary" />
        </IconButton>
      </a>
    </Tooltip>
  );
};

export default SocialLink;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "3rem",
    height: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));
