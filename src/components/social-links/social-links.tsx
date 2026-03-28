import React from "react";
import { Box } from "@mui/material";

import SocialLinkType from "../../types/social-link-type";
import SocialLink from "./social-link";

type SocialLinksProps = {};

const SocialLinks = (props: SocialLinksProps) => {
  const rootSx = {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Box sx={rootSx}>
      {SocialLinkType.AllValues.map((socialLink) => (
        <SocialLink key={socialLink.link} socialLink={socialLink} />
      ))}
    </Box>
  );
};

export default SocialLinks;
