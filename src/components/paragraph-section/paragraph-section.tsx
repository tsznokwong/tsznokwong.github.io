import React from "react";
import { makeStyles, Theme, Container, Typography } from "@material-ui/core";

type ParagraphSectionProps = {
  title: string;
  subtitle: string;
};

const ParagraphSection = (props: ParagraphSectionProps) => {
  const { title, subtitle } = props;
  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth="sm">
      <Typography className={classes.title} variant="h1">
        {title}
      </Typography>
      <Typography className={classes.subtitle} variant="body1">
        {subtitle}
      </Typography>
    </Container>
  );
};

export default ParagraphSection;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: "4rem 0",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  title: {},
  subtitle: {
    padding: "2rem 0",
    whiteSpace: "pre-line",
  },
}));
