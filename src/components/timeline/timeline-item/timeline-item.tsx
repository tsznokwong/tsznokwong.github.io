import React from "react";
import { makeStyles, Theme, Paper, Typography, Chip } from "@material-ui/core";
import {
  TimelineItem as MUITimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@material-ui/lab";

import TimelineItemIcon from "./timeline-item-icon";
import TimelineItemType from "../../../types/timeline-item-type";

export type TimelineItemProps = {
  title?: string;
  subtitle?: string;
  details?: string;
  timestamp?: string;
  type?: TimelineItemType;
};

const TimelineItem = (props: TimelineItemProps) => {
  const classes = useStyles();
  const { title, subtitle, details, timestamp, type } = props;
  return (
    <MUITimelineItem>
      <TimelineOppositeContent className={classes.oppositeContent} />
      <TimelineSeparator>
        <TimelineDot color="primary">
          <TimelineItemIcon type={type} defaultColor="primary" />
        </TimelineDot>
        <TimelineConnector className={classes.connector} />
      </TimelineSeparator>
      <TimelineContent>
        <Paper className={classes.content} elevation={3}>
          {type && (
            <Chip
              className={classes.chip}
              label={type}
              color="secondary"
              size="small"
            />
          )}
          {title && (
            <Typography className={classes.title} variant="h3">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography className={classes.subtitle} variant="h6">
              {subtitle}
            </Typography>
          )}
          {timestamp && (
            <Typography
              className={classes.timestamp}
              variant="body2"
              color="textSecondary"
            >
              {timestamp}
            </Typography>
          )}
          {details && (
            <Typography
              className={classes.details}
              variant="body2"
              color="textPrimary"
            >
              {details}
            </Typography>
          )}
        </Paper>
      </TimelineContent>
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
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    padding: "1rem",
    backgroundColor: theme.palette.background.paper,
    marginBottom: "2rem",
    textAlign: "left",
  },
  title: { color: theme.palette.primary.dark },
  subtitle: { color: theme.palette.primary.light, fontStyle: "italic" },
  timestamp: { fontStyle: "italic" },
  details: {
    padding: "1rem 0",
    whiteSpace: "pre-line",
  },
  chip: {
    color: theme.palette.primary.main,
    marginBottom: "1rem",
  },
}));
