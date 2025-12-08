import React, { ElementType } from "react";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import ExtensionIcon from "@mui/icons-material/Extension";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import FlareIcon from "@mui/icons-material/Flare";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";

import MUIColor from "../../../types/mui-color";
import TimelineItemType, {
  TimelineItemTypes,
} from "../../../types/timeline-item-type";

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
  if (!type || !TimelineItemTypes.includes(type)) {
    return <Brightness1Icon color={defaultColor} />;
  }
  const Icon = Icons[type];
  return <Icon color={color} />;
};

export default TimelineItemIcon;
