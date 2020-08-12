import React from "react";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";

export type LinkMeta = {
  Icon: React.ElementType;
  link: string;
  title: string;
};

const LinkedIn: LinkMeta = {
  Icon: LinkedInIcon,
  link: "https://www.linkedin.com/in/joshua-wong-8b5101171/",
  title: "LinkedIn",
};

const GitHub: LinkMeta = {
  Icon: GitHubIcon,
  link: "https://github.com/tsznokwong",
  title: "GitHub",
};

const AllValues: LinkMeta[] = [LinkedIn, GitHub];

const SocialLinkType = {
  LinkedIn: LinkedIn,
  GitHub: GitHub,
  AllValues: AllValues,
};

export default SocialLinkType;
