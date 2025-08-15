// import { format } from "date-fns";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Tooltip, alpha, useTheme, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import CustomTable from "components/common/custom-table";
import CustomSearch from "components/common/custom-search";
import { ReservationSWR, GroupReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "./new";
import Search from "./search";
import ReservationEdit from "components/front-office/reservation-list/edit";
import { ModalContext } from "lib/context/modal";

interface ReservationListProps {
  title: string;
  workingDate: string;
  viewMode?: 'arrival' | 'group';
  onViewModeChange?: (mode: 'arrival' | 'group') => void;
  dateFilter?: 'today' | 'tomorrow' | 'weekly';
}

const DeparturedListList = ({ title, workingDate, viewMode = 'arrival', onViewModeChange, dateFilter }: ReservationListProps) => {
  const router = useRouter();
  const { StatusGroup, StartDate, EndDate, ReservationTypeID } = router.query;
  const [rerenderKey, setRerenderKey] = useState(0);
  const [currentDateFilter, setCurrentDateFilter] = useState<'today' | 'tomorrow' | 'weekly'>('today');

  // Calculate date range based on filter
  const getDateRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    switch (currentDateFilter) {
      case 'today': {
        return { startDate: todayStr, endDate: todayStr };
      }
      case 'tomorrow': {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const tomorrowYear = tomorrow.getFullYear();
        const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0');
        const tomorrowStr = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;
        return { startDate: tomorrowStr, endDate: tomorrowStr };
      }
      case 'weekly': {
        const weekEnd = new Date(now);
        weekEnd.setDate(now.getDate() + 7);
        const weekEndYear = weekEnd.getFullYear();
        const weekEndMonth = String(weekEnd.getMonth() + 1).padStart(2, '0');
        const weekEndDay = String(weekEnd.getDate()).padStart(2, '0');
        const weekEndStr = `${weekEndYear}-${weekEndMonth}-${weekEndDay}`;
        return { startDate: todayStr, endDate: weekEndStr };
      }
      default: {
        return { startDate: todayStr, endDate: todayStr };
      }
    }
  };

  const { startDate, endDate } = getDateRange();

  useEffect(() => {
    setRerenderKey((prevKey) => prevKey + 1);
  }, [StatusGroup, StartDate, EndDate, ReservationTypeID]);

  const intl = useIntl();
  const theme = useTheme();

  const { handleModal }: any = useContext(ModalContext);

  // Single reservation columns
  const singleColumns = [
    {
      title: intl.formatMessage({
        id: "RowHeaderReservationNo",
      }),
      key: "ReservationNo",
      dataIndex: "ReservationNo",
    },

    {
      title: intl.formatMessage({
        id: "RowHeaderArrival",
      }),
      key: "ArrivalDate",
      dataIndex: "ArrivalDate",
      renderCell: (element: any) => {
        return element.row.ArrivalDate ? format(
          new Date(element.row.ArrivalDate.replace(/ /g, "T")),
          "MM/dd/yyyy"
        ) : "";
      },
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderDeparture",
      }),
      key: "DepartureDate",
      dataIndex: "DepartureDate",
      renderCell: (element: any) => {
        return element.row.DepartureDate ? format(
          new Date(element.row.DepartureDate.replace(/ /g, "T")),
          "MM/dd/yyyy"
        ) : "";
      },
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderGuest",
      }),
      key: "GuestName",
      dataIndex: "GuestName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderUserPhone",
      }),
      key: "GuestPhone",
      dataIndex: "GuestPhone",
      renderCell: (element: any) => {
        // Display guest phone if available, otherwise show empty
        return element.row.GuestPhone || element.row.Phone || element.row.Mobile || "";
      },
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderUserEmail",
      }),
      key: "GuestEmail",
      dataIndex: "GuestEmail",
      renderCell: (element: any) => {
        return element.row.GuestEmail || element.row.Email || "";
      },
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderRoom",
      }),
      key: "RoomFullName",
      dataIndex: "RoomFullName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderCompany",
      }),
      key: "CustomerName",
      dataIndex: "CustomerName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderTotalAmount",
      }),
      key: "TotalAmount",
      dataIndex: "TotalAmount",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderBalance",
      }),
      key: "CurrentBalance",
      dataIndex: "CurrentBalance",
    },

    {
      title: intl.formatMessage({
        id: "RowHeaderReservationType",
      }),
      key: "ReservationTypeName",
      dataIndex: "ReservationTypeName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderUserName",
      }),
      key: "UserName",
      dataIndex: "UserName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderAction",
      }),
      key: "Action",
      dataIndex: "Action",
      renderCell: (element: any) => {
        return (
          <Button
            key={element.id}
            onClick={() =>
              handleModal(
                true,
                `${intl.formatMessage({
                  id: "ButtonEdit",
                })}`,
                <ReservationEdit
                  transactionID={element.id}
                  extendedProps={{
                    GroupID: element.GroupID
                      ? element.GroupID
                      : null,
                  }}
                />,
                null,
                "large"
              )
            }
          >
            {intl.formatMessage({
              id: "ButtonEdit",
            })}
          </Button>
        );
      },
    },
  ];

  // Group reservation columns
  const groupColumns = [
    {
      title: intl.formatMessage({
        id: "RowHeaderGroupCode",
      }),
      key: "GroupCode",
      dataIndex: "GroupCode",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderCustomerName",
      }),
      key: "CustomerName",
      dataIndex: "CustomerName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderRoom",
      }),
      key: "Rooms",
      dataIndex: "Rooms",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderPax",
      }),
      key: "Pax",
      dataIndex: "Pax",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderArrival",
      }),
      key: "ArrivalDate",
      dataIndex: "ArrivalDate",
      renderCell: (element: any) => {
        return element.row.ArrivalDate ? format(
          new Date(element.row.ArrivalDate.replace(/ /g, "T")),
          "MM/dd/yyyy"
        ) : "";
      },
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderDeparture",
      }),
      key: "DepartureDate",
      dataIndex: "DepartureDate",
      renderCell: (element: any) => {
        return element.row.DepartureDate ? format(
          new Date(element.row.DepartureDate.replace(/ /g, "T")),
          "MM/dd/yyyy"
        ) : "";
      },
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderGuide",
      }),
      key: "GuideName",
      dataIndex: "GuideName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderTotal",
      }),
      key: "TotalCharge",
      dataIndex: "TotalCharge",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderPaid",
      }),
      key: "TotalPayment",
      dataIndex: "TotalPayment",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderUserName",
      }),
      key: "UserName",
      dataIndex: "UserName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderAction",
      }),
      key: "Action",
      dataIndex: "Action",
      renderCell: (element: any) => {
        return (
          <Button
            key={element.id}
            onClick={() =>
              handleModal(
                true,
                `${intl.formatMessage({
                  id: "ButtonEdit",
                })}`,
                <ReservationEdit
                  transactionID={element.id}
                  extendedProps={{
                    GroupID: element.GroupID
                      ? element.GroupID
                      : null,
                  }}
                />,
                null,
                "large"
              )
            }
          >
            {intl.formatMessage({
              id: "ButtonEdit",
            })}
          </Button>
        );
      },
    },
  ];

  // Use appropriate columns based on view mode
  const columns = viewMode === 'arrival' ? singleColumns : groupColumns;

  const validationSchema = yup.object().shape({
    StartDate: yup.date().nullable(),
    EndDate: yup.date().nullable(),
    ReservationTypeID: yup.string().nullable(),
    ReservationSourceID: yup.string().nullable(),
    StatusGroup: yup.string().nullable(),
    GuestName: yup.string(),
    GuestPhone: yup.string(),
    GuestEmail: yup.string(),
    CustomerID: yup.string(),
  });
  console.log("workingdate", StartDate ? StartDate : workingDate);
  const formOptions = {
    defaultValues: {
      StatusGroup: StatusGroup ? String(StatusGroup) : "1",
      StartDate: StartDate ? String(StartDate) : startDate,
      EndDate: EndDate ? String(EndDate) : endDate,
      ReservationTypeID: ReservationTypeID ? String(ReservationTypeID) : null,
    },
    resolver: yupResolver(validationSchema),
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);

  const [search, setSearch] = useState({
    StatusGroup: StatusGroup ? String(StatusGroup) : "1",
    StartDate: StartDate ? String(StartDate) : startDate,
    EndDate: EndDate ? String(EndDate) : endDate,
    ReservationTypeID: ReservationTypeID ? String(ReservationTypeID) : "1",
  });

  // Group search parameters for GroupReservationSWR
  const [groupSearch, setGroupSearch] = useState({
    StartDate: StartDate ? String(StartDate) : startDate,
    EndDate: EndDate ? String(EndDate) : endDate,
    GroupID: 0,
    GroupInReserv: true,
    GroupInHouse: false,
    GroupDeparted: false,
    GroupCode: ""
  });

  // Update search when date filter changes - improved with dependency handling
  useEffect(() => {
    const { startDate: newStartDate, endDate: newEndDate } = getDateRange();
    setSearch(prev => ({
      ...prev,
      StartDate: StartDate ? String(StartDate) : newStartDate,
      EndDate: EndDate ? String(EndDate) : newEndDate
    }));
    setGroupSearch(prev => ({
      ...prev,
      StartDate: StartDate ? String(StartDate) : newStartDate,
      EndDate: EndDate ? String(EndDate) : newEndDate
    }));
  }, [currentDateFilter, StartDate, EndDate]);

  // useEffect(() => {
  //     setSearch({
  //         StatusGroup: StatusGroup ? StatusGroup : "1",
  //         StartDate: StartDate ? StartDate : workingDate.split("T")[0],
  //         EndDate: EndDate ? EndDate : null,
  //         ReservationTypeID: ReservationTypeID ? ReservationTypeID : null,
  //     });
  // }, [workingDate]);

  // Trigger re-render when query parameters change
  useEffect(() => {
    setRerenderKey(prev => prev + 1);
  }, [StatusGroup, StartDate, EndDate, ReservationTypeID, currentDateFilter]);

  // Use different API endpoints based on view mode
  const { data: singleData, error: singleError } = ReservationSWR(viewMode === 'arrival' ? search : null);
  const { data: groupData, error: groupError } = GroupReservationSWR(viewMode === 'group' ? groupSearch : null);

  // Filter data to show only non-group operations (GroupOperation: false)
  const rawData = viewMode === 'arrival' ? singleData : groupData;
  const data = rawData ? rawData.filter((item: any) => item.GroupOperation === false) : rawData;
  const error = viewMode === 'arrival' ? singleError : groupError;

  const handleDateFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: 'today' | 'tomorrow' | 'weekly'
  ) => {
    if (newFilter !== null && newFilter !== currentDateFilter) {
      setCurrentDateFilter(newFilter);
    }
  };

  const DateFilterButtons = () => (
    <div className="bg-[#28a745] rounded-full outline outline-[#28a745] outline-2 shadow-md overflow-hidden ml-2">
      <ToggleButtonGroup
        value={currentDateFilter}
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
        <Tooltip title="Today's reservations" arrow>
          <ToggleButton value="today" aria-label="today">
            {intl.formatMessage({ id: "TextToday" })}
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Tomorrow's reservations" arrow>
          <ToggleButton value="tomorrow" aria-label="tomorrow">
            {intl.formatMessage({ id: "TextTomorrow" })}

          </ToggleButton>
        </Tooltip>
        <Tooltip title="Weekly reservations" arrow>
          <ToggleButton value="weekly" aria-label="weekly">
            {intl.formatMessage({ id: "TextWeekly" })}

          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </div>
  );



  return (
    <>
      {rerenderKey && (
        <CustomTable
          columns={columns}
          data={data}
          error={error}
          api={ReservationAPI}
          hasNew={true}
          hasUpdate={false}
          hasDelete={false}
          hasShow={false}
          id={viewMode === 'arrival' ? "TransactionID" : "GroupID"}
          datagrid={true}
          listUrl={listUrl}
          modalTitle={title}
          modalContent={<NewEdit workingDate={workingDate} />}
          excelName={title}
          additionalButtons={
            <div className="flex items-center">
              <DateFilterButtons />
            </div>
          }
          search={
            <CustomSearch
              listUrl={listUrl}
              search={viewMode === 'arrival' ? search : groupSearch}
              setSearch={viewMode === 'arrival' ? setSearch : setGroupSearch}
              handleSubmit={handleSubmit}
              reset={reset}
              searchInitialState={viewMode === 'arrival' ? {
                StatusGroup: StatusGroup ? StatusGroup : "1",
                StartDate: StartDate
                  ? StartDate
                  : startDate,
                EndDate: EndDate ? EndDate : endDate,
                ReservationTypeID: ReservationTypeID
                  ? ReservationTypeID
                  : 1,
              } : {
                StartDate: StartDate
                  ? StartDate
                  : startDate,
                EndDate: EndDate ? EndDate : endDate,
                GroupID: 0,
                GroupInReserv: true,
                GroupInHouse: false,
                GroupDeparted: false,
                GroupCode: ""
              }}
            >
              <Search
                register={register}
                errors={errors}
                control={control}
                reset={reset}
              />
            </CustomSearch>
          }
          modalsize="medium"
        />
      )}
    </>
  );
};

export default DeparturedListList;
