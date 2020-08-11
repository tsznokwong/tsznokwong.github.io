import React, { ElementType } from "react";
import SchoolIcon from "@material-ui/icons/School";
import WorkIcon from "@material-ui/icons/Work";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import ExtensionIcon from "@material-ui/icons/Extension";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import FlareIcon from "@material-ui/icons/Flare";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";

import MUIColor from "../../../types/mui-color";
import TimelineItemType from "../../../types/timeline-item-type";

type TimelineItemIconsProps = {
  type?: TimelineItemType;
  color?: MUIColor;
  defaultColor?: MUIColor;
};

const Icons: { [type in TimelineItemType]: ElementType } = {
  Education: SchoolIcon,
  Work: WorkIcon,
  Projects: ExtensionIcon,
  Achievements: FlareIcon,
  Milestones: ChangeHistoryIcon,
  Activities: LocalActivityIcon,
};

const TimelineItemIcon = (props: TimelineItemIconsProps) => {
  const { type, color, defaultColor } = props;
  if (!type) {
    return <Brightness1Icon color={defaultColor} />;
  }
  const Icon = Icons[type];
  return <Icon color={color} />;
};

export default TimelineItemIcon;
