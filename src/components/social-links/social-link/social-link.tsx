import React from "react";
import { IconButton } from "@mui/material";

import Tooltip from "../../tooltip";
import { LinkMeta } from "../../../types/social-link-type";

type SocialLinkProps = {
  socialLink: LinkMeta;
};

const SocialLink = (props: SocialLinkProps) => {
  const { Icon, link, title } = props.socialLink;

  const rootSx = {
    width: "3rem",
    height: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Tooltip title={title} placement="top">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <IconButton sx={rootSx} disableRipple size="large">
          <Icon color="primary" />
        </IconButton>
      </a>
    </Tooltip>
  );
};

export default SocialLink;
