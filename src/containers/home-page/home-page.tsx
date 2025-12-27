import React from "react";
import { Theme, Container } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import ParagraphSection from "../../components/paragraph-section/paragraph-section";
import Data from "../../assets/data/home-page.json";
import Portrait0 from "../../assets/images/portrait-0.svg";
import Firebird from "../../assets/images/hkust-firebird.svg";
import LionRock from "../../assets/images/lion-rock.png";
import LondonLandscape from "../../assets/images/london-landscape.png";

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
        className={classes.sectionNewHomeContainer}
        title={Data.section_new_home_title}
        subtitle={Data.section_new_home_subtitle}
        background={LondonLandscape}
      />
      <ParagraphSection
        className={classes.sectionUniContainer}
        title={Data.section_uni_title}
        subtitle={Data.section_uni_subtitle}
        background={Firebird}
      />
      <ParagraphSection
        className={classes.sectionRootContainer}
        title={Data.section_root_title}
        subtitle={Data.section_root_subtitle}
        background={LionRock}
        secondaryText
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
  sectionNewHomeContainer: {
    backgroundPositionX: "35%",
    backgroundPositionY: "75%",
    padding: "28vh 0 6vh",
  },
  sectionUniContainer: {
    padding: "28vh 0 6vh",
  },
  sectionRootContainer: {
    backgroundPositionX: "25%",
    backgroundPositionY: "35%",
    padding: "28vh 0 12vh",
  }
}));
