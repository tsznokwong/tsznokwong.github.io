import React from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { Timeline as MUITimeline } from "@material-ui/lab";

import PageContainer from "../page-container";
import TimelineItem from "./timeline-item";

type TimelineProps = {};

const Timeline = (props: TimelineProps) => {
  const classes = useStyles();
  return (
    <PageContainer className={classes.root}>
      <MUITimeline>
        <TimelineItem />
        <TimelineItem />
        <TimelineItem />
        <TimelineItem />
        <TimelineItem />
      </MUITimeline>
    </PageContainer>
  );
};

export default Timeline;

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  oppositeContent: {
    flex: 0,
  },
  connector: {
    backgroundColor: theme.palette.primary.main,
  },
}));
