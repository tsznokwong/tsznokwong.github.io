import React, { useState } from "react";
import { makeStyles, Theme, Button, ButtonGroup } from "@material-ui/core";
import { Timeline as MUITimeline } from "@material-ui/lab";

import PageContainer from "../page-container";
import TimelineItem, { TimelineItemProps } from "./timeline-item";
import { TimelineItemTypes } from "../../types/timeline-item-type";
import TimelineItemIcon from "./timeline-item/timeline-item-icon";
import Tooltip from "../tooltip";

type TimelineProps = {
  items: TimelineItemProps[];
};

const Timeline = (props: TimelineProps) => {
  const classes = useStyles();
  const { items } = props;
  const [filter, setFilter] = useState(TimelineItemTypes);
  return (
    <PageContainer className={classes.root}>
      <ButtonGroup>
        {TimelineItemTypes.map((type) => (
          <Tooltip title={type} aria-label={type}>
            <Button
              className={
                filter.includes(type)
                  ? classes.filterButtonSelected
                  : classes.filterButton
              }
              onClick={() => {
                setFilter(
                  TimelineItemTypes.filter((filterType) => {
                    const isFiltered = filter.includes(filterType);
                    const clicked = type === filterType;
                    return !isFiltered === clicked;
                  })
                );
              }}
              disableRipple
            >
              <TimelineItemIcon type={type} color="primary" />
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
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
    borderColor: theme.palette.primary.main,
  },
  filterButtonSelected: {
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
    backgroundColor: theme.palette.secondary.light,
    borderColor: theme.palette.primary.main,
  },
}));
