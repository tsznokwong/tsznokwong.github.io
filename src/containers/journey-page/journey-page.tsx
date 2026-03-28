import React from "react";
import { Container } from "@mui/material";
import ParagraphSection from "../../components/paragraph-section";
import Timeline from "../../components/timeline";
import Data from "../../assets/data/journey-page.json";
import { TimelineItemProps } from "../../components/timeline/timeline-item";
import Portrait1 from "../../assets/images/portrait-1.svg";

type JourneyPageProps = {};

const JourneyPage = (props: JourneyPageProps) => {
  const rootSx = {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
  };

  const introContainerSx = {
    marginTop: "1rem",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "75%",
  };

  const timelineContainerSx = {
    marginTop: "1rem",
  };

  return (
    <Container sx={rootSx} maxWidth={false} disableGutters>
      <ParagraphSection
        sx={introContainerSx}
        title={Data.title}
        subtitle={Data.subtitle}
        background={Portrait1}
      />
      <Timeline
        sx={timelineContainerSx}
        items={Data.timeline.map((item) => item as TimelineItemProps)}
      />
    </Container>
  );
};

export default JourneyPage;
