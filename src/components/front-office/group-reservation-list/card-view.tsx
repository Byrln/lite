import { useState, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
} from "@mui/material";
import { MoreVert, Group, Hotel, CalendarToday, Person, ViewList, ViewModule } from "@mui/icons-material";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import moment from "moment";
import GroupTableView from "./table-view";

import { GroupReservationSWR } from "lib/api/reservation";
import { TransactionAPI } from "lib/api/transaction";
import { ModalContext } from "lib/context/modal";
import { dateStringToObj, formatNumber } from "lib/utils/helpers";

interface GroupCardViewProps {
  workingDate: string;
  groupColor?: string;
  viewMode?: 'table' | 'card';
  onViewModeChange?: (mode: 'table' | 'card') => void;
  externalViewMode?: 'arrival' | 'group';
  onExternalViewModeChange?: (event: React.MouseEvent<HTMLElement>, newView: 'arrival' | 'group') => void;
}

const GroupCardView = ({ workingDate, groupColor, viewMode, onViewModeChange, externalViewMode, onExternalViewModeChange }: GroupCardViewProps) => {

  const intl = useIntl();
  const theme = useTheme();
  const { handleModal }: any = useContext(ModalContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [roomDetails, setRoomDetails] = useState<Record<string, any>>({});
  const [loadingRooms, setLoadingRooms] = useState<Record<string, boolean>>({});

  const [search] = useState({
    StartDate: workingDate.split("T")[0],
    EndDate: moment(
      dateStringToObj(moment(workingDate).format("YYYY-MM-DD")),
      "YYYY-MM-DD"
    )
      .add(1, "months")
      .format("YYYY-MM-DD"),
    GroupID: "",
    GroupInReserv: true,
    GroupInHouse: false,
    GroupDeparted: false,
    GroupCode: ""
  });

  const { data, error } = GroupReservationSWR(search);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, group: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  const fetchRoomDetails = async (groupID: string) => {
    if (roomDetails[groupID] || loadingRooms[groupID]) {
      return; // Already loaded or loading
    }

    setLoadingRooms(prev => ({ ...prev, [groupID]: true }));

    try {
      const rooms = await TransactionAPI.getByGroupID(groupID);
      setRoomDetails(prev => ({ ...prev, [groupID]: rooms }));
    } catch (error) {
      console.error('Error fetching room details:', error);
      setRoomDetails(prev => ({ ...prev, [groupID]: [] }));
    } finally {
      setLoadingRooms(prev => ({ ...prev, [groupID]: false }));
    }
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'table' | 'card'
  ) => {
    if (newView !== null && onViewModeChange) {
      onViewModeChange(newView);
    }
  };





  // Use the data directly as it's already grouped by the API
  const groups = data || [];

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">{intl.formatMessage({ id: "TextErrorLoadingGroupReservations" })}</Typography>
      </Box>
    );
  }

  if (!groups.length) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>{intl.formatMessage({ id: "TextNoGroupReservationsFound" })}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {groups.map((group: any) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={group.GroupID}>
            <Card
              sx={{
                height: '100%',
                border: group.GroupColor ? `2px solid ${group.GroupColor}` : '1px solid #e0e0e0',
                backgroundColor: 'white',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', my: 2 }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {group.GuestName}
                  </Typography>
                  <div className="absolute top-0 mx-auto bg-primary-light py-2 px-24 rounded-b-xl">
                    <div className="flex items-center gap-[4px] text-white">
                      <CalendarToday sx={{ fontSize: 16 }} />
                      <p className="text-xs">{group.ArrivalDate ? format(
                        new Date(group.ArrivalDate.replace(/ /g, "T")),
                        "MMM dd"
                      ) : ''} - {group.DepartureDate ? format(
                        new Date(group.DepartureDate.replace(/ /g, "T")),
                        "MMM dd"
                      ) : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className={`text-sm ${group.GroupColor ? `text-${group.GroupColor}` : 'text-black'}`}>
                      #{group.GroupCode}
                    </p>
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuClick(event, group)}
                    >
                      <MoreVert />
                    </IconButton>
                  </div>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: "space-between" }}>
                    <Tooltip
                      title={
                        <div>
                          {loadingRooms[group.GroupID] ? (
                            <p>{intl.formatMessage({ id: "TextLoadingRoomDetails" })}</p>
                          ) : roomDetails[group.GroupID] && roomDetails[group.GroupID].length > 0 ? (
                            <div>
                              {roomDetails[group.GroupID].map((room: any, index: number) => (
                                <div key={index} style={{ marginBottom: '4px' }}>
                                  <strong>{room.RoomTypeName}:</strong> {room.RoomFullNo}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>{intl.formatMessage({ id: "TextNoRoomDetailsAvailable" })}</p>
                          )}
                        </div>
                      }
                      arrow
                      placement="top"
                    >
                      <div
                        className="flex items-center gap-[4px] bg-amber-200 px-2 py-1 rounded-full cursor-pointer"
                        onMouseEnter={() => fetchRoomDetails(group.GroupID)}
                      >
                        <Hotel sx={{ fontSize: 16, color: 'text.gray' }} />
                        <p className="text-xs text-gray-800">
                          {group.Rooms}
                        </p>
                      </div>
                    </Tooltip>
                    <div className="flex items-center gap-[4px] bg-amber-200 px-2 py-1 rounded-full">
                      <Person sx={{ fontSize: 16, color: 'text.gray' }} />
                      <p className="text-xs text-gray-800">
                        {group.PaxAdult || '0'} {intl.formatMessage({ id: "TextAdult" })}/ {group.PaxChild || '0'} {intl.formatMessage({ id: "TextChild" })}
                      </p>
                    </div>
                  </Box>
                </Box>

                <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1, flexWrap: "wrap" }}>
                  {group.CustomerName && (
                    <div className="flex items-center gap-[4px] bg-blue-200 px-2 py-1 rounded-full">
                      <p className="text-xs text-gray-800">
                        {intl.formatMessage({ id: "TextCompany" })}: {group.CustomerName}
                      </p>
                    </div>
                  )}
                  {group.ReservationSourceName && (
                    <div className="flex items-center gap-[4px] bg-green-200 px-2 py-1 rounded-full">
                      <p className="text-xs text-gray-800">
                        {intl.formatMessage({ id: "TextSource" })}: {group.ReservationSourceName}
                      </p>
                    </div>
                  )}
                  {group.GuideName && (
                    <div className="flex items-center gap-[4px] bg-purple-200 px-2 py-1 rounded-full">
                      <p className="text-xs text-gray-800">
                        {intl.formatMessage({ id: "TextGuide" })}: {group.GuideName}
                      </p>
                    </div>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {intl.formatMessage({ id: "TextTotal" })}: {formatNumber(group.TotalCharge || "0")} {group.CurrencyCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {intl.formatMessage({ id: "TextPaid" })}: {formatNumber(group.TotalPayment || "0")} {group.CurrencyCode}
                  </Typography>
                  <Chip
                    label={group.UserName || ' '}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          View Group Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Edit Group
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Add New Guest
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Print Invoice
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Email Invoice
        </MenuItem>
      </Menu>
    </>
  );
};

export default GroupCardView;