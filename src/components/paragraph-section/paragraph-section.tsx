import React from "react";
import { Theme, Typography } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import PageContainer from "../page-container";

type ParagraphSectionProps = {
  title?: string;
  subtitle?: string;
  background?: string;
  className?: string;
  secondaryText?: boolean;
};

const ParagraphSection = (props: ParagraphSectionProps) => {
  const { title, subtitle, background, className, secondaryText } = props;
  const classes = useStyles();
  return (
    <PageContainer
      className={`${classes.root} ${className}`}
      background={background}
    >
      {title && (
        <Typography className={secondaryText ? classes.titleSecondary : classes.title} variant="h1">
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          className={secondaryText ? classes.subtitleSecondary : classes.subtitle}
          variant="body1"
          color="textPrimary"
        >
          {subtitle}
        </Typography>
      )}
    </PageContainer>
  );
};

export default ParagraphSection;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: "28vh 0 12vh",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  title: { color: theme.palette.primary.main },
  titleSecondary: { color: theme.palette.secondary.main },
  subtitle: {
    padding: "2rem 0",
    whiteSpace: "pre-line",
  },
  subtitleSecondary: {
    padding: "2rem 0",
    whiteSpace: "pre-line",
    color: theme.palette.secondary.main,
  },
}));
