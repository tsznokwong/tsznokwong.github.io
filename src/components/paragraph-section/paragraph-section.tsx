import React from "react";
import { makeStyles, Theme, Typography } from "@material-ui/core";

import PageContainer from "../page-container";

type ParagraphSectionProps = {
  title?: string;
  subtitle?: string;
  background?: string;
};

const ParagraphSection = (props: ParagraphSectionProps) => {
  const { title, subtitle, background } = props;
  const classes = useStyles();
  return (
    <PageContainer className={classes.root} background={background}>
      {title && (
        <Typography className={classes.title} variant="h1">
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          className={classes.subtitle}
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
    padding: "20vh 0 16vh",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  title: { color: theme.palette.primary.dark },
  subtitle: {
    padding: "2rem 0",
    whiteSpace: "pre-line",
  },
}));
