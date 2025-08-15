import { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ViewList, ViewModule } from "@mui/icons-material";
import { useIntl } from "react-intl";

import GroupTableView from "./table-view";
import GroupCardView from "./card-view";

interface GroupReservationListProps {
  title: string;
  workingDate: string;
  groupColor?: string;
  viewMode?: 'arrival' | 'group';
  onViewModeChange?: (event: React.MouseEvent<HTMLElement>, newView: 'arrival' | 'group') => void;
  tableCardViewMode?: 'table' | 'card';
}

const GroupReservationList = ({ title, workingDate, groupColor, viewMode: externalViewMode, onViewModeChange, tableCardViewMode }: GroupReservationListProps) => {
  const [internalViewMode, setInternalViewMode] = useState<'table' | 'card'>(tableCardViewMode || 'table');
  const intl = useIntl();

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'table' | 'card'
  ) => {
    if (newView !== null) {
      setInternalViewMode(newView);
    }
  };

  // Use external tableCardViewMode if provided, otherwise use internal state
  const currentViewMode = tableCardViewMode || internalViewMode;

  return (
    <Box>
      {currentViewMode === 'table' ? (
        <GroupTableView
          title={title}
          workingDate={workingDate}
          groupColor={groupColor}
          viewMode={currentViewMode}
          onViewModeChange={setInternalViewMode}
          externalViewMode={externalViewMode}
          onExternalViewModeChange={onViewModeChange}
        />
      ) : (
        <GroupCardView
          workingDate={workingDate}
          groupColor={groupColor}
          viewMode={currentViewMode}
          onViewModeChange={setInternalViewMode}
          externalViewMode={externalViewMode}
          onExternalViewModeChange={onViewModeChange}
        />
      )}
    </Box>
  );
};

export default GroupReservationList;