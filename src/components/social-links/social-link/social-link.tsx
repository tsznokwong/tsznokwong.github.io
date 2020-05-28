import React from "react";
import {
  makeStyles,
  Theme,
  IconButton,
  Tooltip,
  withStyles,
} from "@material-ui/core";

import * as SocialLinkType from "../../../types/social-link-type";

type SocialLinkProps = {
  socialLink: SocialLinkType.LinkMeta;
};

const SocialLink = (props: SocialLinkProps) => {
  const { Icon, link, title } = props.socialLink;
  const classes = useStyles();
  return (
    <CustomTooltip title={title} placement="top">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <IconButton className={classes.root} disableRipple>
          <Icon color="primary" />
        </IconButton>
      </a>
    </CustomTooltip>
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

const CustomTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
  },
}))(Tooltip);
