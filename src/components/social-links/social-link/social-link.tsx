import React from "react";
import { makeStyles, Theme, IconButton } from "@material-ui/core";

import * as SocialLinkType from "../../../types/social-link-type";

type SocialLinkProps = {
  socialLink: SocialLinkType.LinkMeta;
};

const SocialLink = (props: SocialLinkProps) => {
  const { Icon, link } = props.socialLink;
  const classes = useStyles();
  return (
    <IconButton className={classes.root} disableRipple>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <Icon color="primary" />
      </a>
    </IconButton>
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
