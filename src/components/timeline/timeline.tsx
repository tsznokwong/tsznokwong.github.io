import React from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { Timeline as MUITimeline } from "@material-ui/lab";

import PageContainer from "../page-container";
import TimelineItem, { TimelineItemProps } from "./timeline-item";

type TimelineProps = {
  items: TimelineItemProps[];
};

const Timeline = (props: TimelineProps) => {
  const classes = useStyles();
  const { items } = props;
  return (
    <PageContainer className={classes.root}>
      <MUITimeline>
        {items.map((item, index) => (
          <TimelineItem key={`timeline_item_${index}`} {...item} />
        ))}
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
