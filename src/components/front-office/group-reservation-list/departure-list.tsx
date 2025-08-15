import { useState } from "react";
import { ToggleButton, ToggleButtonGroup, Tooltip, alpha, useTheme } from "@mui/material";
import { useIntl } from "react-intl";

import CustomTable from "components/common/custom-table";
import { DepartureSWR, ReservationAPI, listUrl } from "lib/api/reservation";


const columns = [
  {
    title: "Res No",
    key: "ReservationNo",
    dataIndex: "ReservationNo",
  },
  {
    title: "Arrival",
    key: "ArrivalDate",
    dataIndex: "ArrivalDate",
  },
  {
    title: "Departure",
    key: "DepartureDate",
    dataIndex: "DepartureDate",
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
    title: "company",
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
    title: "User",
    key: "UserName",
    dataIndex: "UserName",
  },
];

const GroupDepartureList = ({ title }: any) => {
  // const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'weekly'>('today');
  const intl = useIntl();
  const theme = useTheme();

  // // Calculate date range based on filter
  // const getDateRange = () => {
  //   const today = new Date();

  //   if (dateFilter === 'today') {
  //     const todayStr = today.toISOString().split('T')[0];
  //     return { startDate: todayStr, endDate: todayStr };
  //   } else if (dateFilter === 'tomorrow') {
  //     const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  //     const tomorrowStr = tomorrow.toISOString().split('T')[0];
  //     return { startDate: tomorrowStr, endDate: tomorrowStr };
  //   } else if (dateFilter === 'weekly') {
  //     const todayStr = today.toISOString().split('T')[0];
  //     const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  //     const weekLaterStr = weekLater.toISOString().split('T')[0];
  //     return { startDate: todayStr, endDate: weekLaterStr };
  //   } else {
  //     // Default: today only
  //     const todayStr = today.toISOString().split('T')[0];
  //     return { startDate: todayStr, endDate: todayStr };
  //   }
  // };

  // const { startDate, endDate } = getDateRange();

  // Prepare search parameters for DepartureList API
  // const departureSearchParams = {
  //   ArrivalDate: startDate,
  //   DepartureDate: endDate
  // };

  const { data: rawData, error } = DepartureSWR({
    GroupOperation: true,
  });

  // Filter data to show only reservations with specific pattern like "146-1"
  const data = rawData
    ? rawData.filter((item: any) => {
      if (!item.ReservationNo) return false;
      const parts = item.ReservationNo.split('-');
      return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]);
    })
    : rawData;

  // const handleDateFilterChange = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newFilter: 'today' | 'tomorrow' | 'weekly'
  // ) => {
  //   if (newFilter !== null) {
  //     setDateFilter(newFilter);
  //   }
  // };

  // const DateFilterButtons = () => (
  //   <div className="bg-[#28a745] rounded-full outline outline-[#28a745] outline-2 shadow-md overflow-hidden ml-2">
  //     <ToggleButtonGroup
  //       value={dateFilter}
  //       exclusive
  //       onChange={handleDateFilterChange}
  //       aria-label="date filter"
  //       size="small"
  //       sx={{
  //         '& .MuiToggleButton-root': {
  //           border: 'none',
  //           borderRadius: '50px',
  //           px: 2,
  //           py: 1,
  //           color: 'white',
  //           fontSize: '0.875rem',
  //           fontWeight: 500,
  //           transition: 'all 0.2s ease-in-out',
  //           '&:hover': {
  //             bgcolor: alpha('#FFFFFF', 0.1),
  //           },
  //           '&.Mui-selected': {
  //             bgcolor: 'white',
  //             color: '#28a745',
  //             boxShadow: theme.shadows[2],
  //             '&:hover': {
  //               bgcolor: 'white',
  //             },
  //           },
  //         },
  //       }}
  //     >
  //       <Tooltip title="Today's departures" arrow>
  //         <ToggleButton value="today" aria-label="today">
  //           {intl.formatMessage({ id: "TextToday" })}
  //         </ToggleButton>
  //       </Tooltip>
  //       <Tooltip title="Tomorrow's departures" arrow>
  //         <ToggleButton value="tomorrow" aria-label="tomorrow">
  //           {intl.formatMessage({ id: "TextTomorrow" })}

  //         </ToggleButton>
  //       </Tooltip>
  //       <Tooltip title="Weekly departures" arrow>
  //         <ToggleButton value="weekly" aria-label="weekly">
  //           {intl.formatMessage({ id: "TextWeekly" })}
  //         </ToggleButton>
  //       </Tooltip>
  //     </ToggleButtonGroup>
  //   </div>
  // );



  return (
    <CustomTable
      columns={columns}
      data={data}
      error={error}
      api={ReservationAPI}
      hasNew={false}
      hasUpdate={false}
      hasDelete={false}
      id="ReservationNo"
      listUrl={listUrl}
      modalTitle={title}
      excelName={title}
      datagrid={true}
    // additionalButtons={
    //   <div className="flex items-center">
    //     <DateFilterButtons />
    //   </div>
    // }
    />
  );
};

export default GroupDepartureList;
