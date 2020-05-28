import React from "react";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";

export type LinkMeta = {
  Icon: React.ElementType;
  link: string;
  title: string;
};

export const LinkedIn: LinkMeta = {
  Icon: LinkedInIcon,
  link: "https://www.linkedin.com/in/joshua-wong-8b5101171/",
  title: "LinkedIn",
};

export const GitHub: LinkMeta = {
  Icon: GitHubIcon,
  link: "https://github.com/tsznokwong",
  title: "GitHub",
};

export const AllValues: LinkMeta[] = [LinkedIn, GitHub];
