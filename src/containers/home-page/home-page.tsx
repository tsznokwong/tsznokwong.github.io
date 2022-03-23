import React from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";

import ParagraphSection from "../../components/paragraph-section/paragraph-section";
import Data from "../../assets/data/home-page.json";
import Portrait0 from "../../assets/images/portrait-0.svg";
import Firebird from "../../assets/images/hkust-firebird.svg";

type HomePageProps = {};

const HomePage = (props: HomePageProps) => {
  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth={false} disableGutters>
      <ParagraphSection
        className={classes.introContainer}
        title={Data.title}
        subtitle={Data.subtitle}
        background={Portrait0}
      />
      <ParagraphSection
        className={classes.sectionUniContainer}
        title={Data.section_uni_title}
        subtitle={Data.section_uni_subtitle}
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
  introContainer: {
    marginTop: "1rem",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "75%",
    backgroundPositionY: "25%",
    padding: "28vh 0 6vh",
  },
  sectionUniContainer: {
  }
}));
