import React from "react";
import { makeStyles, Theme } from "@material-ui/core";
import {
  TimelineItem as MUITimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@material-ui/lab";

type TimelineItemProps = {};

const TimelineItem = (props: TimelineItemProps) => {
  const classes = useStyles();
  return (
    <MUITimelineItem>
      <TimelineSeparator>
        <TimelineDot color="primary" />
        <TimelineConnector className={classes.connector} />
      </TimelineSeparator>
      <TimelineContent>Eat</TimelineContent>
      <TimelineOppositeContent className={classes.oppositeContent} />
    </MUITimelineItem>
  );
};

export default TimelineItem;

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  oppositeContent: {
    flex: 0,
    padding: "0",
  },
  connector: {
    backgroundColor: theme.palette.primary.main,
  },
}));
