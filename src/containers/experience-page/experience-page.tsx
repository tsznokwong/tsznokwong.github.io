import React from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";
import ParagraphSection from "../../components/paragraph-section";
import Timeline from "../../components/timeline";
import Data from "../../assets/data/experience-page.json";

type ExperiencePageProps = {};

const ExperiencePage = (props: ExperiencePageProps) => {
  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth={false} disableGutters>
      <ParagraphSection title={Data.title} subtitle={Data.subtitle} />
      <Timeline items={Data.timeline} />
    </Container>
  );
};

export default ExperiencePage;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
}));
