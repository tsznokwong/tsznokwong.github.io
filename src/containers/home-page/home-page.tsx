import React from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";

import ParagraphSection from "../../components/paragraph-section/paragraph-section";
import Data from "../../assets/data/home-page.json";

type HomePageProps = {};

const HomePage = (props: HomePageProps) => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <ParagraphSection title={Data.title} subtitle={Data.subtitle} />
    </Container>
  );
};

export default HomePage;

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
  },
}));
