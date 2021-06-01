import React from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";
import ParagraphSection from "../../components/paragraph-section";
import Timeline from "../../components/timeline";
import Data from "../../assets/data/journey-page.json";
import { TimelineItemProps } from "../../components/timeline/timeline-item";
import Portrait1 from "../../assets/images/portrait-1.svg";

type JourneyPageProps = {};

const JourneyPage = (props: JourneyPageProps) => {
  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth={false} disableGutters>
      <ParagraphSection
        className={classes.introContainer}
        title={Data.title}
        subtitle={Data.subtitle}
        background={Portrait1}
      />
      <Timeline
        items={Data.timeline.map((item) => item as TimelineItemProps)}
      />
    </Container>
  );
};

export default JourneyPage;

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    introContainer: {
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPositionX: "75%",
    },
  };
});
