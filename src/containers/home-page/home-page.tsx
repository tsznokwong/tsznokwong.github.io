import React from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";

import ParagraphSection from "../../components/paragraph-section/paragraph-section";
import Data from "../../assets/data/home-page.json";
import Firebird from "../../assets/images/hkust-firebird.svg";

type HomePageProps = {};

const HomePage = (props: HomePageProps) => {
  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth={false} disableGutters>
      <ParagraphSection
        title={Data.title}
        subtitle={Data.subtitle}
        background={Firebird}
      />
    </Container>
  );
};

export default HomePage;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
}));
