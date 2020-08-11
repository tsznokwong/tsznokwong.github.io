import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import {
  Timeline as MUITimeline,
  ToggleButtonGroup,
  ToggleButton,
} from "@material-ui/lab";

import PageContainer from "../page-container";
import TimelineItem, { TimelineItemProps } from "./timeline-item";
import { TimelineItemTypes } from "../../types/timeline-item-type";
import TimelineItemIcon from "./timeline-item/timeline-item-icon";

type TimelineProps = {
  items: TimelineItemProps[];
};

const Timeline = (props: TimelineProps) => {
  const classes = useStyles();
  const { items } = props;
  const [filter, setFilter] = useState(TimelineItemTypes);
  return (
    <PageContainer className={classes.root}>
      <ToggleButtonGroup
        value={filter}
        onChange={(event, newFilter) => {
          setFilter(newFilter);
        }}
        aria-label="timeline filtering"
      >
        {TimelineItemTypes.map((type) => (
          <ToggleButton
            className={classes.filterButton}
            key={type}
            value={type}
            aria-label={type}
            disableRipple
          >
            <TimelineItemIcon type={type} color="primary" />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <MUITimeline>
        {items
          .filter((item) => (item.type ? filter.includes(item.type) : true))
          .map((item, index) => (
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
  filterButton: {
    "&:hover": {
      backgroundColor: `${theme.palette.secondary.main} !important`,
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.secondary.light,
      borderColor: theme.palette.primary.main,
    },
    borderColor: theme.palette.primary.main,
  },
}));
