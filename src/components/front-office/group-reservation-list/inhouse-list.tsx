import { format } from "date-fns";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup, Tooltip, alpha, useTheme } from "@mui/material";
import { useIntl } from "react-intl";

import CustomTable from "components/common/custom-table";
import { GroupReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";

const columns = [
  {
    title: "Res No",
    key: "TransactionID",
    dataIndex: "TransactionID",
  },
  {
    title: "Arrival",
    key: "ArrivalDate",
    dataIndex: "ArrivalDate",
    render: function render(id: any, value: any) {
      return (value && format(
        new Date(value.replace(/ /g, "T")),
        "MM/dd/yyyy"
      ));
    },
  },
  {
    title: "Departure",
    key: "DepartureDate",
    dataIndex: "DepartureDate",
    render: function render(id: any, value: any) {
      return (value && format(
        new Date(value.replace(/ /g, "T")),
        "MM/dd/yyyy"
      ));
    },
  },
  {
    title: "Guest",
    key: "GuestName",
    dataIndex: "GuestName",
  },
  {
    title: "Room",
    key: "RoomFullName",
    dataIndex: "RoomFullName",
  },
  {
    title: "Company",
    key: "CustomerName",
    dataIndex: "CustomerName",
  },
  {
    title: "Total",
    key: "TotalAmount",
    dataIndex: "TotalAmount",
  },
  {
    title: "Paid",
    key: "CurrentBalance",
    dataIndex: "CurrentBalance",
  },
  {
    title: "ResType",
    key: "ReservationTypeName",
    dataIndex: "ReservationTypeName",
  },
  {
    title: "User",
    key: "UserName",
    dataIndex: "UserName",
  },
];

const GroupInHouseList = ({ title }: any) => {
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'weekly'>('today');
  const intl = useIntl();
  const theme = useTheme();

  const getDateRange = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    switch (dateFilter) {
      case 'today':
        return {
          startDate: today.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      case 'tomorrow':
        return {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0]
        };
      case 'weekly':
        return {
          startDate: today.toISOString().split('T')[0],
          endDate: weekEnd.toISOString().split('T')[0]
        };
      default:
        return {
          startDate: today.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
    }
  };

  const { startDate, endDate } = getDateRange();

  // Use GroupReservationSWR with GroupInHouse parameter
  const groupSearchParams = {
    StartDate: startDate,
    EndDate: endDate,
    GroupInHouse: true
  };

  const { data, error } = GroupReservationSWR(groupSearchParams);

  const handleDateFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: 'today' | 'tomorrow' | 'weekly'
  ) => {
    if (newFilter !== null) {
      setDateFilter(newFilter);
    }
  };

  const DateFilterButtons = () => (
    <div className="bg-[#28a745] rounded-full outline outline-[#28a745] outline-2 shadow-md overflow-hidden ml-2">
      <ToggleButtonGroup
        value={dateFilter}
        exclusive
        onChange={handleDateFilterChange}
        aria-label="date filter"
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            border: 'none',
            borderRadius: '50px',
            px: 2,
            py: 1,
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: alpha('#FFFFFF', 0.1),
            },
            '&.Mui-selected': {
              bgcolor: 'white',
              color: '#28a745',
              boxShadow: theme.shadows[2],
              '&:hover': {
                bgcolor: 'white',
              },
            },
          },
        }}
      >
        <Tooltip title="Today's in-house guests" arrow>
          <ToggleButton value="today" aria-label="today">
            {intl.formatMessage({ id: "TextToday" })}
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Tomorrow's in-house guests" arrow>
          <ToggleButton value="tomorrow" aria-label="tomorrow">
            {intl.formatMessage({ id: "TextTomorrow" })}
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Weekly in-house guests" arrow>
          <ToggleButton value="weekly" aria-label="weekly">
            {intl.formatMessage({ id: "TextWeekly" })}
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </div>
  );



  return (
    <CustomTable
      columns={columns}
      data={data}
      error={error}
      api={ReservationAPI}
      hasNew={false}
      hasUpdate={false}
      hasDelete={false}
      id="TransactionID"
      listUrl={listUrl}
      modalTitle={title}
      excelName={title}
      datagrid={true}
      additionalButtons={
        <div className="flex items-center">
          <DateFilterButtons />
        </div>
      }
    />
  );
};

export default GroupInHouseList;
