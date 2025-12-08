import React from "react";
import { Theme, Box } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import SocialLinkType from "../../types/social-link-type";
import SocialLink from "./social-link";

type SocialLinksProps = {};

const SocialLinks = (props: SocialLinksProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {SocialLinkType.AllValues.map((socialLink) => (
        <SocialLink key={socialLink.link} socialLink={socialLink} />
      ))}
    </Box>
  );
};

export default SocialLinks;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
}));
