import React from "react";
import { makeStyles, Theme, IconButton } from "@material-ui/core";

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
        <IconButton className={classes.root} disableRipple>
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
