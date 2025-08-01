import React, { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import {
  Tooltip,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";
import { RoomTypeAPI } from "lib/api/room-type";
import { RoomAPI } from "lib/api/room";
import { ReservationAPI } from "lib/api/reservation";
import { StayView2API } from "lib/api/stay-view2";
import { FrontOfficeAPI } from "lib/api/front-office";
import NewReservation from "components/front-office/reservation-list/new";
import { ModalContext } from "lib/context/modal";
import { RoomBlockAPI } from "lib/api/room-block";
import { dateToCustomFormat } from "lib/utils/format-time";
import { useAppState } from "lib/context/app";
import ReservationEdit from "components/front-office/reservation-list/edit";
import RoomMoveForm from "components/reservation/room-move";
import AmendStayForm from "components/reservation/amend-stay";
import RoomAssignGroup from "components/reservation/room-assign-group";
import Iconify from "components/iconify/iconify";
import { getContrastYIQ } from "lib/utils/helpers";
import { useIntl } from "react-intl";
import RoomTypeCustomSelect from "components/select/room-type-custom";
import DatePickerCustom from "../mui/MuiDatePickerCustom";
import Image from "next/image";
import { RoomStatusSWR } from "lib/api/room-status";

export const generateIncrementedId = (baseId: string | number, increment: number = 1, conflictChecker?: (id: string | number) => boolean): string | number => {
  if (conflictChecker) {
    let currentId = typeof baseId === 'number' ? baseId + increment : baseId;
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      if (typeof currentId === 'number') {
        if (!conflictChecker(currentId)) {
          return currentId;
        }
        currentId = currentId + 1;
      } else {
        const numMatch = currentId.toString().match(/(\d+)$/);
        if (numMatch) {
          const baseStr = currentId.toString().replace(/(\d+)$/, '');
          const num = parseInt(numMatch[1]);
          const testId = `${baseStr}${num}`;
          if (!conflictChecker(testId)) {
            return testId;
          }
          currentId = `${baseStr}${num + 1}`;
        } else {
          const testId = `${currentId}_${attempts + 1}`;
          if (!conflictChecker(testId)) {
            return testId;
          }
          currentId = testId;
        }
      }
      attempts++;
    }
    return typeof baseId === 'number' ? baseId + increment + attempts : `${baseId}_${increment + attempts}`;
  }

  if (typeof baseId === 'number') {
    return (baseId + increment).toString();
  }
  const numMatch = baseId.match(/(\d+)$/);
  if (numMatch) {
    const baseStr = baseId.replace(/(\d+)$/, '');
    const num = parseInt(numMatch[1]) + increment;
    return `${baseStr}${num}`;
  }
  return `${baseId}_${increment}`;
};

const MyCalendar: React.FC = ({ workingDate }: any) => {
  const intl = useIntl();
  const [state, dispatch]: any = useAppState();
  const { handleModal }: any = useContext(ModalContext);
  const [dayCount, setDayCount] = useState(15);
  const [search, setSearch] = useState({
    CurrDate: workingDate,
    NumberOfDays: dayCount,
    RoomTypeID: 0,
  });
  const [searchCurrDate, setSearchCurrDate] = useState(workingDate);
  const [searchRoomTypeID, setSearchRoomTypeID] = useState(0);

  const onRoomTypeChange = (rt: any) => {
    setSearchRoomTypeID(rt ? rt.RoomTypeID : 0);
  };
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [reservationItems, setReservationItems] = useState<any>(null);
  const [roomBlocks, setRoomBlocks] = useState<any>(null);

  // Fetch room status data
  const { data: roomStatusData } = RoomStatusSWR({ RoomTypeID: 0 });

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  useEffect(() => {
    const hoverSetting = localStorage.getItem("isHover");
    setIsHoverEnabled(hoverSetting === "true");
  }, []);

  const handleHoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsHoverEnabled(checked);
    localStorage.setItem("isHover", checked.toString());
  };

  function extractNumberFromString(str: any) {
    const parts = str.split("-");
    const firstNumber = parseInt(parts[1], 10);

    return firstNumber;
  }

  function areDatesOnSameDay(date1: any, date2: any) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const customHeader = (info: any) => {
    const dateText =
      info.currentRange.end.toISOString().slice(0, 10) +
      " " +
      info.currentRange.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    const day = info.currentRange.start.getDay();
    const isWeekend = day === 0 || day === 6;

    const monthNames = [
      intl.formatMessage({ id: "January" }) || "January",
      intl.formatMessage({ id: "February" }) || "February",
      intl.formatMessage({ id: "March" }) || "March",
      intl.formatMessage({ id: "April" }) || "April",
      intl.formatMessage({ id: "May" }) || "May",
      intl.formatMessage({ id: "June" }) || "June",
      intl.formatMessage({ id: "July" }) || "July",
      intl.formatMessage({ id: "August" }) || "August",
      intl.formatMessage({ id: "September" }) || "September",
      intl.formatMessage({ id: "October" }) || "October",
      intl.formatMessage({ id: "November" }) || "November",
      intl.formatMessage({ id: "December" }) || "December",
    ];
    const monthName = monthNames[info.currentRange.start.getMonth()];

    return (
      <div
        style={{
          padding: "6px 8px",
          backgroundColor: isWeekend ? "#ffd700" : "#f8f9fa", // Solid yellow for weekends
          borderRadius: "6px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: isWeekend ? "#ff9800" : "#4a6cf7",
            marginBottom: "4px",
            textTransform: "uppercase",
          }}
        >
          {info.dayHeader.text}
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#212529",
          }}
        >
          {dateText}
        </div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "#666",
            marginTop: "2px",
          }}
        >
          {monthName}
        </div>
      </div>
    );
  };

  const [timeStart, setTimeStart] = useState(
    new Date(searchCurrDate ? searchCurrDate : workingDate)
  );
  const [timeEnd, setTimeEnd] = useState(
    new Date(
      new Date(searchCurrDate ? searchCurrDate : workingDate).setDate(
        new Date(
          searchCurrDate ? searchCurrDate : workingDate
        ).getDate() + dayCount
      )
    )
  );
  const [resources, setResources] = useState<any>(null);
  const [itemData, setItemData] = useState<any>(null);
  const [rerenderKey, setRerenderKey] = useState(0);
  const [customMutate, setCustomMutate] = useState(0);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [height, setHeight] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<any>(null);
  const [currentView, setCurrentView] = useState("resourceTimeline");

  useEffect(() => {
    if (searchCurrDate == "Огноо алдаатай байна!") {
      setSearchCurrDate(new Date(workingDate));

      setTimeStart(new Date(workingDate));
      setTimeEnd(
        new Date(
          new Date(workingDate).setDate(
            new Date(workingDate).getDate() + dayCount
          )
        )
      );
    } else {
      setTimeStart(new Date(searchCurrDate));
      setTimeEnd(
        new Date(
          new Date(searchCurrDate).setDate(
            new Date(searchCurrDate).getDate() + dayCount
          )
        )
      );
    }

    const fetchDatas = async () => {
      try {
        const items: any = await FrontOfficeAPI?.list({
          CurrDate: searchCurrDate ? searchCurrDate : workingDate,
          NumberOfDays: dayCount,
          RoomTypeID: searchRoomTypeID,
        });

        const roomTypes: any = await RoomTypeAPI?.list({
          RoomTypeID: searchRoomTypeID,
        });

        const rooms: any = await RoomAPI?.list({});

        const roomBlocksData: any = await RoomBlockAPI?.list({
          StartDate: dateToCustomFormat(
            new Date(searchCurrDate),
            "yyyy-MM-dd"
          ),
          EndDate: dateToCustomFormat(
            new Date(
              new Date(searchCurrDate).setDate(
                new Date(searchCurrDate).getDate() + dayCount
              )
            ),
            "yyyy-MM-dd"
          ),
        });
        setRoomBlocks(roomBlocksData);

        const availableRoomsData: any = await StayView2API?.list(
          searchCurrDate ? searchCurrDate : workingDate,
          dayCount
        );

        setAvailableRooms(availableRoomsData);
        setReservationItems(items);

        const groupReservations: any =
          await ReservationAPI?.groupReservation({
            StartDate: dateToCustomFormat(
              new Date(searchCurrDate),
              "yyyy-MM-dd"
            ),
            EndDate: dateToCustomFormat(
              new Date(
                new Date(searchCurrDate).setDate(
                  new Date(searchCurrDate).getDate() +
                  dayCount
                )
              ),
              "yyyy-MM-dd"
            ),
          });

        let itemDataConcated: any = [];
        let letNewEvents: any = null;
        let roomTypesObj: any = [];
        let newItemDta: any = [];
        let doesCombinationExist = function (
          eventsArray: any,
          startDateToCheck: any,
          resourceIdToCheck: any
        ) {
          for (const event of eventsArray) {
            if (
              event.startDate === startDateToCheck &&
              event.resourceId === resourceIdToCheck
            ) {
              return event;
            }
          }
          return false;
        };

        if (items) {
          newItemDta = items.map((obj: any) => {
            // Debug Balance values
            if (obj.Balance && obj.Balance.toString().includes('1')) {
              console.log("Found Balance with '1':", {
                TransactionID: obj.TransactionID,
                GuestName: obj.GuestName,
                Balance: obj.Balance,
                BalanceType: typeof obj.Balance,
                BalanceString: obj.Balance.toString()
              });
            }
            return obj.RoomID
              ? {
                id: obj.TransactionID,
                title: obj.GuestName,
                start: obj.ArrivalDate || obj.StartDate,
                end: obj.DepartureDate || obj.EndDate,
                resourceId: obj.RoomID
                  ? obj.RoomID
                  : `${obj.RoomTypeName}-${obj.RoomTypeID}`,
                roomTypeID: obj.RoomTypeID,
                transactionID: obj.TransactionID,
                startDate: obj.ArrivalDate || obj.StartDate,
                departureDate: obj.DepartureDate || obj.EndDate,
                GroupID: obj.GroupID,
                Balance: obj.Balance,
                Adult: obj.Adult,
                Child: obj.Child,
                pax:
                  obj.GroupID &&
                    groupReservations &&
                    groupReservations.filter(
                      (item: any) =>
                        item.GroupID == obj.GroupID
                    ).length > 0
                    ? groupReservations.filter(
                      (item: any) =>
                        item.GroupID == obj.GroupID
                    )[0].Pax
                    : null,
                Breakfast: obj.Breakfast,
                endDate: obj.DepartureDate || obj.EndDate,
                groupColor: `${obj.GroupColor}`,
                GroupCode: `${obj.GroupCode}`,
                IsGroupOwner: `${obj.IsGroupOwner}`,
                statusColor: `#${obj.StatusColor}`,
                statusGroup: obj.StatusGroup,
                editable: !obj.StatusCode,
                color: getContrastYIQ(`#${obj.StatusColor}`),
                textColor: getContrastYIQ(
                  `#${obj.StatusColor}`
                ),
                border: "none",
              }
              : {};
          });
          newItemDta = newItemDta.filter(
            (event: any) => Object.keys(event).length > 0
          );

          let noRooms = items.map((obj: any) => {
            return !obj.RoomID
              ? {
                id: obj.TransactionID,
                title: obj.GuestName,
                start: obj.ArrivalDate || obj.StartDate,
                end: obj.DepartureDate || obj.EndDate,
                resourceId: `${obj.RoomTypeName}?${obj.RoomTypeID}`,
                roomTypeID: obj.RoomTypeID,
                transactionID: obj.TransactionID,
                startDate: obj.ArrivalDate || obj.StartDate,
                endDate: obj.DepartureDate || obj.EndDate,
                Balance: obj.Balance,
                GroupID: obj.GroupID,
                Adult: obj.Adult,
                Child: obj.Child,
                Breakfast: obj.Breakfast,
                departureDate: obj.DepartureDate || obj.EndDate,
                groupColor: `${obj.GroupColor}`,
                GroupCode: `${obj.GroupCode}`,
                IsGroupOwner: `${obj.IsGroupOwner}`,
                statusColor: `#${obj.StatusColor}`,
                statusGroup: obj.StatusGroup,
                editable: !obj.StatusCode,
                color: getContrastYIQ(`#${obj.StatusColor}`),
                textColor: getContrastYIQ(
                  `#${obj.StatusColor}`
                ),
                border: "none",
                unassignedRoom: "true",
              }
              : {};
          });

          noRooms = noRooms.filter(
            (event: any) => Object.keys(event).length > 0
          );

          const groupedEvents = groupEventsByDate(noRooms);

          letNewEvents = groupedEvents.flatMap((dateGroup: any) => {
            return dateGroup.map((level2: any, index: any) => {
              return {
                id: generateIncrementedId(level2.resourceId, index),
                title: level2.count,
                start: `${level2.date} 00:00:00`,
                end: `${level2.date} 23:59:59`,
                allDay: true,
                resourceId: level2.resourceId,
                startDate: `${level2.date} 00:00:00`,
                departureDate: `${level2.date} 23:59:59`,
                endDate: `${level2.date} 23:59:59`,
                editable: true,
                color: "red",
                textColor: "black",
                border: "none",
                entities: level2.events,
                statusColor: "rgba(255, 220, 40, 0.15)",
              };
            });
          });

          if (roomBlocksData) {
            const newRoomBlockDta = roomBlocksData.map((obj: any) => {
              return {
                id: obj.RoomBlockID,
                title: "Blocked",
                start: obj.BeginDate,
                end: obj.EndDate,
                resourceId: obj.RoomID,
                roomTypeID: obj.RoomTypeID,
                editable: false,
                color: "black",
                block: true,
              };
            });
            itemDataConcated =
              itemDataConcated.concat(newRoomBlockDta);
          }

          if (items) {
            const statusCheckedOutItems = items.filter(
              (obj: any) => obj.StatusCode === "StatusCheckedOut"
            );
            if (statusCheckedOutItems.length > 0) {
              const newStatusCheckedOutDta =
                statusCheckedOutItems.map((obj: any) => {
                  return {
                    id: generateIncrementedId(`${obj.TransactionID}_checkout`, 0),
                    title: "Checked Out",
                    start: obj.ArrivalDate || obj.StartDate,
                    end: obj.DepartureDate || obj.EndDate,
                    resourceId: obj.RoomID,
                    roomTypeID: obj.RoomTypeID,
                    editable: false,
                    color: "gray",
                    textColor: "white",
                    block: true,
                  };
                });
              itemDataConcated = itemDataConcated.concat(
                newStatusCheckedOutDta
              );
            }
          }
        }

        for (let i = 0; i < dayCount; i++) {
          const currentDate = new Date(
            new Date(searchCurrDate).getTime()
          );
          currentDate.setDate(currentDate.getDate() + i);

          roomTypes &&
            roomTypes.map((obj: any) => {
              if (
                doesCombinationExist(
                  letNewEvents,
                  `${moment(currentDate).format(
                    "YYYY-MM-DD"
                  )} 00:00:00`,
                  `${obj.RoomTypeName}?${obj.RoomTypeID}`
                )
              ) {
                roomTypesObj.push(
                  doesCombinationExist(
                    letNewEvents,
                    `${moment(currentDate).format(
                      "YYYY-MM-DD"
                    )} 00:00:00`,
                    `${obj.RoomTypeName}?${obj.RoomTypeID}`
                  )
                );
              } else {
                roomTypesObj.push({
                  id: `${obj.RoomTypeName}-${obj.RoomTypeID}-${obj.SortOrder}`,
                  title: 0,
                  start: `${moment(currentDate).format(
                    "YYYY-MM-DD"
                  )} 00:00:00`,
                  end: `${moment(currentDate).format(
                    "YYYY-MM-DD"
                  )} 23:59:59`,
                  allDay: true,
                  resourceId: `${obj.RoomTypeName}?${obj.RoomTypeID}`,
                  startDate: `${moment(currentDate).format(
                    "YYYY-MM-DD"
                  )} 00:00:00`,
                  endDate: `${moment(currentDate).format(
                    "YYYY-MM-DD"
                  )} 23:59:59`,
                  editable: true,
                  color: "white",
                  textColor: "black",
                  border: "none",
                  statusColor: "rgba(255, 220, 40, 0.15)",
                });
              }
            });
        }

        itemDataConcated = itemDataConcated
          .concat(newItemDta)
          .concat(roomTypesObj);
        setItemData(itemDataConcated);

        if (rooms.data && roomTypes) {
          const newRoomTypeData = roomTypes.map((obj: any) => {
            return {
              id: `${obj.RoomTypeName}?${obj.RoomTypeID}`,
              title: obj.RoomTypeName,
              SortOrder: obj.SortOrder,
            };
          });
          const newData = rooms.data
            .filter((event: any) => event.Status === true)
            .map((obj: any) => {
              return {
                parentId: `${obj.RoomTypeName}?${obj.RoomTypeID}`,
                roomTypeId: obj.RoomTypeID,
                id: obj.RoomID,
                title: obj.RoomNo,
                resourceLaneContent: obj.RoomNo,
                MaxAdult: obj.MaxAdult,
                MaxChild: obj.MaxChild,
                BaseAdult: obj.BaseAdult,
                BaseChild: obj.BaseChild,
                SortOrder: Number(obj.SortOrder),
              };
            })
            .sort((a: any, b: any) => a.SortOrder - b.SortOrder);

          setResources(newRoomTypeData.concat(newData));
        }

        setRerenderKey((prevKey) => prevKey + 1);
      } finally {
      }
    };

    fetchDatas();
  }, [searchRoomTypeID, dayCount, workingDate, searchCurrDate, customMutate]);

  const validationSchema = yup.object().shape({
    CurrDate: yup.string().nullable(),
    NumberOfDays: yup.string().nullable(),
    RoomTypeID: yup.string().nullable(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);

  const handleChange = async (event: any) => {
    try {
      const value = event.target.value;
      if (value === "day") {
        await setDayCount(1);
      } else if (value === "hourly") {
        await setDayCount(1);
        setCurrentView("resourceTimelineDay");
      } else {
        await setDayCount(Number(value));
        setCurrentView("resourceTimeline");
      }
    } finally {
    }
  };

  const groupEventsByDate = (events: any) => {
    const groupedEvents: any = {};

    events.forEach((event: any) => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      const resourceId = event.resourceId;

      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split("T")[0];

        if (!groupedEvents[dateKey]) {
          groupedEvents[dateKey] = {};
        }

        if (!groupedEvents[dateKey][resourceId]) {
          groupedEvents[dateKey][resourceId] = {
            date: dateKey,
            resourceId,
            count: 0,
            events: [],
          };
        }

        groupedEvents[dateKey][resourceId].count++;
        groupedEvents[dateKey][resourceId].events.push(event);

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return Object.values(groupedEvents).map((dateGroup: any) =>
      Object.values(dateGroup)
    );
  };

  useEffect(() => {
    setHeight(window.innerHeight - 90);
  }, [window.innerHeight]);

  const handleEventClick = (info: any) => {
    console.log("info", info.event);
    if (info.event._def.title != "Blocked") {
      if (info.event._def.extendedProps.entities) {
        handleModal(
          true,
          intl.formatMessage({
            id: "ButtonAssignRoom",
          }),
          <RoomAssignGroup
            entities={info.event._def.extendedProps.entities}
            additionalMutateUrl="/api/Reservation/List"
            customRerender={() =>
              setCustomMutate((prevKey) => prevKey + 1)
            }
          />,
          null,
          "large"
        );
      } else {
        handleModal(
          true,
          intl.formatMessage({
            id: "FrontNewReservation",
          }),
          <ReservationEdit
            transactionID={
              info.event._def.extendedProps.transactionID
            }
            extendedProps={info.event._def.extendedProps}
            additionalMutateUrl="/api/Reservation/List"
            customRerender={() =>
              setCustomMutate((prevKey) => prevKey + 1)
            }
          />,
          null,
          "medium"
        );
      }
    }
  };

  const handleEventDrop = (info: any) => {
    if (
      areDatesOnSameDay(
        new Date(info.event._def.extendedProps.startDate),
        info.event._instance.range.start
      ) == false
    ) {
      if (Number(info.event._def.extendedProps.transactionID)) {
        dispatch({
          type: "editId",
          editId: Number(info.event._def.extendedProps.transactionID),
        });
      } else {
        dispatch({
          type: "editId",
          editId: "",
        });
      }
      const hasTimeInfo = currentView === "resourceTimelineDay" || currentView === "timeGridDay";

      let arrivalTime = "14:00";
      let departureTime = "12:00";

      if (hasTimeInfo) {
        arrivalTime = moment(info.event._instance.range.start).format("HH:mm");
        departureTime = moment(info.event._instance.range.end).format("HH:mm");
      }

      const newEventObject = {
        title: "New Event",
        ArrivalDate: info.event._instance.range.start,
        DepartureDate: info.event._instance.range.end,
        ArrivalTime: arrivalTime,
        DepartureTime: departureTime,
        RoomTypeID: Number(info.event._def.extendedProps.roomTypeID),
        RoomID: Number(info.event._def.resourceIds[0]),
        TransactionID: info.event._def.extendedProps.transactionID,
        GroupID: info.event.extendedProps.GroupID
          ? info.event.extendedProps.GroupID
          : null,
      };
      let filteredItemData = itemData.filter(
        (event: any) =>
          event.roomTypeID ===
          Number(info.event._def.extendedProps.roomTypeID) &&
          event.resourceId ==
          Number(info.event._def.resourceIds[0]) &&
          event.id != info.event._def.extendedProps.transactionID &&
          new Date(event.start) <=
          new Date(info.event._instance.range.end) &&
          new Date(event.end) >
          new Date(info.event._instance.range.start)
      );
      console.log("info.event._def", info.event._def);
      if (filteredItemData.length > 0) {
        toast("Захиалга давхцаж байна.");
      } else {
        if (info.event.extendedProps.statusGroup != 3) {
          handleModal(
            true,
            intl.formatMessage({
              id: "ButtonAmendStay",
            }),
            <AmendStayForm
              transactionInfo={newEventObject}
              reservation={newEventObject}
              additionalMutateUrl="/api/Reservation/List"
              customRerender={() =>
                setCustomMutate((prevKey) => prevKey + 1)
              }
            />,
            false,
            "small"
          );
        } else {
          toast("Хугацаа өөрчлөх боломжгүй.");
        }
      }
      setRerenderKey((prevKey) => prevKey + 1);
    } else {
      // Check if the selection includes time information
      const hasTimeInfo = currentView === "resourceTimelineDay" || currentView === "timeGridDay";

      // Set default times if no time information is available
      let arrivalTime = "14:00"; // Default check-in time
      let departureTime = "12:00"; // Default check-out time

      if (hasTimeInfo) {
        arrivalTime = moment(info.event._instance.range.start).format("HH:mm");
        departureTime = moment(info.event._instance.range.end).format("HH:mm");
      }

      const newEventObject = {
        title: "New Event",
        ArrivalDate: info.event._instance.range.start,
        DepartureDate: info.event._instance.range.end,
        ArrivalTime: arrivalTime,
        DepartureTime: departureTime,
        RoomTypeID: Number(
          info.newResource._resource.parentId.split("?")[1]
        ),
        RoomID: Number(info.event._def.resourceIds[0]),
        TransactionID: Number(
          info.event._def.extendedProps.transactionID
        ),
      };

      let filteredItemData = itemData.filter(
        (event: any) =>
          event.roomTypeID ===
          extractNumberFromString(
            info.newResource._resource.parentId
          ) &&
          event.resourceId ==
          Number(info.event._def.resourceIds[0]) &&
          event.id != info.event._def.extendedProps.transactionID &&
          new Date(event.start) <=
          new Date(info.oldEvent._def.extendedProps.endDate) &&
          new Date(event.end) >
          new Date(info.oldEvent._def.extendedProps.startDate)
      );

      if (!info.event.extendedProps.block) {
        if (filteredItemData.length > 0) {
          toast("Захиалга давхцаж байна.");
          setRerenderKey((prevKey) => prevKey + 1);
        } else {
          if (info.event.extendedProps.statusGroup != 3) {
            handleModal(
              true,
              `Room move`,
              <RoomMoveForm
                transactionInfo={newEventObject}
                additionalMutateUrl="/api/Reservation/List"
                customRerender={() =>
                  setCustomMutate((prevKey) => prevKey + 1)
                }
              />,
              null,
              "small"
            );
          } else {
            toast("Өрөө солих боломжгүй.");
          }
        }
      }
      setRerenderKey((prevKey) => prevKey + 1);
    }
  };

  const handleEventResize = async (info: any) => {
    if (Number(info.event._def.extendedProps.transactionID)) {
      dispatch({
        type: "editId",
        editId: Number(info.event._def.extendedProps.transactionID),
      });
    } else {
      dispatch({
        type: "editId",
        editId: "",
      });
    }
    const newEventObject = {
      title: "New Event",
      ArrivalDate: info.event._instance.range.start,
      DepartureDate: info.event._instance.range.end,
      RoomTypeID: Number(info.event._def.extendedProps.roomTypeID),
      RoomID: Number(info.event._def.resourceIds[0]),
      TransactionID: info.event._def.extendedProps.transactionID,
      GroupID: info.event._def.extendedProps.GroupID
        ? info.event._def.extendedProps.GroupID
        : null,
    };
    let filteredItemData = itemData.filter(
      (event: any) =>
        event.roomTypeID ===
        Number(info.event._def.extendedProps.roomTypeID) &&
        event.resourceId == Number(info.event._def.resourceIds[0]) &&
        event.id != info.event._def.extendedProps.transactionID &&
        new Date(event.start) <=
        new Date(info.event._instance.range.end) &&
        new Date(event.end) > new Date(info.event._instance.range.start)
    );

    if (filteredItemData.length > 0) {
      toast("Захиалга давхцаж байна.");
    } else {
      if (info.event.extendedProps.statusGroup != 3) {
        handleModal(
          true,
          "Amend Stay",
          <AmendStayForm
            transactionInfo={newEventObject}
            reservation={newEventObject}
            additionalMutateUrl="/api/Reservation/List"
            customRerender={() =>
              setCustomMutate((prevKey) => prevKey + 1)
            }
          />,
          false,
          "small"
        );
      } else {
        toast("Хугацаа өөрчлөх боломжгүй.");
      }
    }
    setRerenderKey((prevKey) => prevKey + 1);
  };


  const handleSelect = (info: any) => {
    const { start, end, resourceId } = info;
    dispatch({
      type: "editId",
      editId: "",
    });

    let filteredItemData = itemData.filter(
      (event: any) =>
        event.roomTypeID ==
        Number(info.resource._resource.extendedProps.roomTypeId) &&
        event.resourceId == Number(info.resource._resource.id) &&
        new Date(start) <= new Date(event.start) &&
        new Date(event.start) <= new Date(end) &&
        new Date(start) <= new Date(event.end) &&
        new Date(event.end) <= new Date(end)
    );

    // Check if the selection includes time information
    const hasTimeInfo = currentView === "resourceTimelineDay" || currentView === "timeGridDay";

    // Set default times if no time information is available
    let arrivalTime = "14:00"; // Default check-in time
    let departureTime = "12:00"; // Default check-out time

    if (hasTimeInfo) {
      arrivalTime = moment(start).format("HH:mm");
      departureTime = moment(end).format("HH:mm");
    }

    const newEventObject = {
      title: "New Event",
      start: start,
      end: end,
      roomTypeID: Number(
        info.resource._resource.extendedProps.roomTypeId
      ),
      roomID: Number(info.resource._resource.id),
      BaseAdult: Number(info.resource._resource.extendedProps.BaseAdult),
      BaseChild: Number(info.resource._resource.extendedProps.BaseChild),
      MaxAdult: Number(info.resource._resource.extendedProps.MaxAdult),
      MaxChild: Number(info.resource._resource.extendedProps.MaxChild),
    };

    if (newEventObject.roomID) {
      if (filteredItemData.length > 0) {
        toast("Захиалга давхцаж байна.");
      } else {
        handleModal(
          true,
          intl.formatMessage({ id: "FrontNewReservation" }),
          <NewReservation
            dateStart={start}
            dateEnd={end}
            ArrivalTime={arrivalTime}
            DepartureTime={departureTime}
            roomType={newEventObject.roomTypeID}
            room={newEventObject.roomID}
            BaseAdult={newEventObject.BaseAdult}
            BaseChild={newEventObject.BaseChild}
            MaxAdult={newEventObject.MaxAdult}
            MaxChild={newEventObject.MaxChild}
            workingDate={workingDate}
            customRerender={() =>
              setCustomMutate((prevKey) => prevKey + 1)
            }
          />,
          null,
          "medium"
        );
      }
    }
  };

  const eventContent = (arg: any) => {
    return (
      <Tooltip
        title={
          arg.event._def.extendedProps.statusColor ==
            "rgba(255, 220, 40, 0.15)" ? (
            <div
              style={{
                padding: "8px",
                fontWeight: 500,
                display: "flex",
                flexDirection: "row",
                gap: "4px",
              }}
              className="sm:flex-row sm:items-center"
            >
              <span
                style={{
                  color: "#4a6cf7",
                  marginRight: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "2px",
                  }}
                >
                  Unassigned Room:{" "}
                </div>
              </span>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {arg.event.title}
              </span>
            </div>
          ) : arg.event.title == "Blocked" ? (
            <div
              style={{
                display: 'flex',
                padding: "8px",
                fontWeight: 500,
                color: "#ff4842",
              }}
            >
              <Iconify
                icon="mdi:block-helper"
                width="16px"
                style={{
                  marginRight: "6px",
                  verticalAlign: "text-bottom",
                }}
              />
              Blocked
            </div>
          ) : (
            <div
              style={{
                padding: "12px",
                minWidth: "220px",
                borderRadius: "8px",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              {/* Header with name */}
              <div
                title={arg.event.title}
                style={{
                  display: "inline-block",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {arg.event.title}
              </div>

              {/* Info grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "6px 12px",
                }}
              >
                {arg.event._def.extendedProps.GroupCode &&
                  arg.event._def.extendedProps.GroupCode !=
                  "" && (
                    <>
                      <span
                        style={{
                          display: "flex", alignItems: 'center',
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <Iconify
                          icon="clarity:group-line"
                          width="14px"
                          style={{
                            marginRight: "4px",
                            verticalAlign:
                              "text-bottom",
                          }}
                        />
                        Group Code:
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {
                          arg.event._def.extendedProps
                            .GroupCode
                        }
                      </span>
                    </>
                  )}

                <span
                  style={{ display: "flex", alignItems: 'center', color: "rgba(255,255,255,0.7)" }}
                >
                  <Iconify
                    icon="mdi:account-outline"
                    width="14px"
                    style={{
                      marginRight: "4px",
                      verticalAlign: "text-bottom",
                    }}
                  />
                  A/C:
                </span>
                <span style={{ fontWeight: 500 }}>
                  {arg.event._def.extendedProps.Adult}/
                  {arg.event._def.extendedProps.Child}
                </span>

                {arg.event._def.extendedProps.pax && (
                  <>
                    <span
                      style={{
                        display: "flex", alignItems: 'center',
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Iconify
                        icon="mdi:account-group-outline"
                        width="14px"
                        style={{
                          marginRight: "4px",
                          verticalAlign:
                            "text-bottom",
                        }}
                      />
                      Group A/C:
                    </span>
                    <span style={{ fontWeight: 500 }}>
                      {arg.event._def.extendedProps.pax}
                    </span>
                  </>
                )}

                {arg.event._def.extendedProps.Balance &&
                  arg.event._def.extendedProps.Balance !== '0' &&
                  Number(arg.event._def.extendedProps.Balance) > 0 ? (
                  <>
                    <span
                      style={{ display: "flex", alignItems: 'center', color: "rgba(255,255,255,0.7)" }}
                    >
                      <Iconify
                        icon="vaadin:cash"
                        width="14px"
                        style={{
                          marginRight: "4px",
                          verticalAlign: "text-bottom",
                        }}
                      />
                      Balance:
                    </span>
                    <span style={{ fontWeight: 500 }}>
                      {Number(arg.event._def.extendedProps.Balance).toLocaleString()}
                      ₮
                    </span>
                  </>
                ) : null}

                <span
                  style={{ display: "flex", alignItems: 'center', color: "rgba(255,255,255,0.7)" }}
                >
                  <Iconify
                    icon="fluent:food-16-regular"
                    width="14px"
                    style={{
                      marginRight: "4px",
                      verticalAlign: "text-bottom",
                    }}
                  />
                  Breakfast:
                </span>
                <span
                  style={{
                    fontWeight: 500,
                    color: arg.event._def.extendedProps
                      .Breakfast
                      ? "#4caf50"
                      : "#ff9800",
                  }}
                >
                  {arg.event._def.extendedProps.Breakfast
                    ? "Yes"
                    : "No"}
                </span>
              </div>
            </div>
          )
        }
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "#212B36",
              "& .MuiTooltip-arrow": {
                color: "#212B36",
              },
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
              borderRadius: "8px",
              p: 0,
            },
          },
        }}
      >
        <div
          className={`event-custom ${isHoverEnabled
            ? arg.event._def.extendedProps.statusColor ==
              "rgba(255, 220, 40, 0.15)"
              ? ""
              : "hover-enabled"
            : ""
            }`}
          style={{
            display:
              arg.event._def.extendedProps.statusColor !=
                "rgba(255, 220, 40, 0.15)" ||
                arg.event.title == "Blocked"
                ? "flex"
                : "",
            borderRadius:
              arg.event._def.extendedProps.statusColor !=
                "rgba(255, 220, 40, 0.15)"
                ? "6px"
                : "0px",
            background: "none",
            padding: "6px 8px 2px 8px",
            overflow: "",
            margin: "-2px -3px -2px -1px",
            height: "100%",
            textAlign:
              arg.event._def.extendedProps.statusColor !=
                "rgba(255, 220, 40, 0.15)" ||
                arg.event.title == "Blocked"
                ? "left"
                : "center",
            backgroundColor:
              arg.event.title == "Blocked"
                ? "#212529"
                : arg.event._def.extendedProps.statusColor,
            color: arg.event._def.extendedProps.statusColor
              ? arg.event._def.extendedProps.statusColor !=
                "rgba(255, 220, 40, 0.15)"
                ? getContrastYIQ(
                  arg.event._def.extendedProps.statusColor
                )
                : "#4a6cf7"
              : "white",
            border:
              arg.event._def.extendedProps.statusColor ==
                "rgba(255, 220, 40, 0.15)"
                ? `1px solid rgba(74, 108, 247, 0.3)`
                : "null",
            fontSize: "13px",
            fontWeight: "500",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          {arg.event._def.extendedProps.statusColor !=
            "rgba(255, 220, 40, 0.15)" ? (
            <Iconify
              icon="lsicon:drag-filled"
              width="14px"
              style={{ marginRight: "8px", marginTop: "2px" }}
            />
          ) : (
            ""
          )}

          {arg.event._def.extendedProps.GroupID &&
            arg.event._def.extendedProps.GroupID != "" ? (
            <span
              style={{
                marginRight: "8px",
                marginTop: "2px",
                color:
                  arg.event._def.extendedProps.groupColor &&
                    arg.event._def.extendedProps.groupColor !=
                    ""
                    ? arg.event._def.extendedProps
                      .groupColor
                    : "#495057",
              }}
            >
              {arg.event._def.extendedProps.IsGroupOwner ==
                "true" ? (
                <Iconify
                  icon="solar:crown-outline"
                  width="14px"
                />
              ) : (
                <Iconify
                  icon="clarity:group-line"
                  width="14px"
                />
              )}
            </span>
          ) : (
            <></>
          )}

          {arg.event._def.extendedProps.Balance &&
            arg.event._def.extendedProps.Balance !== '0' &&
            Number(arg.event._def.extendedProps.Balance) > 0 ? (
            <span style={{ marginRight: "8px", marginTop: "2px" }}>
              {" "}
              <Iconify icon="vaadin:cash" width="14px" />
            </span>
          ) : (
            <></>
          )}

          {arg.event._def.extendedProps.Breakfast &&
            arg.event._def.extendedProps.Breakfast == true ? (
            <span style={{ marginRight: "8px", marginTop: "2px" }}>
              {" "}
              <Iconify
                icon="fluent:food-16-regular"
                width="14px"
              />
            </span>
          ) : (
            <></>
          )}
          <p
            title={arg.event.title}
            style={{
              display: "inline-block",
              fontWeight: "600",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              width: "fit-content",
            }}
          >
            {arg.event.title}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              width: "100%",
              alignItems: "center",
              overflow: "hidden",
              marginLeft: "35px",
            }}
            className={
              isHoverEnabled ? "time-balance-container" : ""
            }
          >
            <div className="flex gap-3 mb-1">
              {/* Departure Time */}
              <div
                className="whitespace-nowrap time-info"
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "11px",
                }}
              >
                <Iconify
                  icon="mdi:logout"
                  width="10px"
                  style={{ marginRight: "2px" }}
                />
                <span>
                  {new Date(
                    arg.event._def.extendedProps.departureDate
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {arg.event._def.extendedProps.Balance &&
                arg.event._def.extendedProps.Balance !== '0' &&
                Number(arg.event._def.extendedProps.Balance) > 0 ? (
                <div
                  className="balance-info"
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "500",
                  }}
                >
                  {Number(
                    arg.event._def.extendedProps.Balance
                  ).toLocaleString()}
                  ₮
                </div>
              ) : null}
            </div>
          </div>

          {arg.event._def.extendedProps.statusColor !=
            "rgba(255, 220, 40, 0.15)" ? (
            <Iconify
              icon="lsicon:drag-filled"
              width="14px"
              style={{ marginLeft: "auto", marginTop: "2px" }}
            />
          ) : (
            ""
          )}
        </div>
      </Tooltip>
    );
  };

  return (
    timeStart && (
      <>
        {/* Calendar Controls Section */}
        <div className="mb-8 space-y-4">
          {/* Main Actions Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Primary Actions Group */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* New Reservation Button */}
              <Button
                onClick={() => {
                  dispatch({
                    type: "editId",
                    editId: null,
                  });
                  handleModal(
                    true,
                    intl.formatMessage({ id: "FrontNewReservation" }),
                    <NewReservation
                      workingDate={workingDate}
                      customRerender={() =>
                        setCustomMutate((prevKey) => prevKey + 1)
                      }
                    />,
                    null,
                    "medium"
                  );
                }}
                className="bg-[#804FE6] hover:bg-[#6B3BC0] text-white font-medium px-6 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Icon
                  style={{ color: "white", marginRight: "8px" }}
                  icon={plusFill}
                  width={16}
                  height={16}
                />
                <span className="font-bold">{intl.formatMessage({ id: "FrontNewReservation" })}</span>
              </Button>

              {/* Refresh Button */}
              <Button
                onClick={() => {
                  setIsCalendarLoading(true);
                  setRerenderKey((prevKey) => prevKey + 1);
                  setTimeout(() => {
                    setIsCalendarLoading(false);
                  });
                }}
                disabled={isCalendarLoading}
                className="border-[#804FE6] text-[#804FE6] hover:bg-[#804FE6] hover:text-white font-medium py-2 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                <Image
                  src="/images/logo_sm.png"
                  alt="Refresh"
                  width={20}
                  height={20}
                  className="w-7 h-4"
                />
              </Button>
              {/* Hover Toggle */}
              <div className="flex items-center space-x-2 bg-white border border-[#804FE6] rounded-full px-3 py-2 shadow-sm cursor-pointer" onClick={() => setIsHoverEnabled(!isHoverEnabled)}>
                <Checkbox
                  checked={isHoverEnabled}
                  onChange={handleHoverChange}
                  sx={{
                    padding: "0px",
                    color: "#804fe6",
                    "&.Mui-checked": {
                      color: "#804fe6",
                    },
                    "& .MuiSvgIcon-root": { fontSize: 16 },
                  }}
                />
                <span className="text-sm font-semibold text-black">Hover</span>
              </div>
              {/* Filters Group */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Room Type Filter */}
                <div className="bg-white border border-[#804FE6] rounded-full shadow-sm min-w-[160px]">
                  <RoomTypeCustomSelect
                    searchRoomTypeID={searchRoomTypeID}
                    setSearchRoomTypeID={setSearchRoomTypeID}
                    onRoomTypeChange={onRoomTypeChange}
                    baseStay={{ RoomTypeID: searchRoomTypeID }}
                    label={intl.formatMessage({
                      id: "TextRoomType",
                    })}
                  />
                </div>

                {/* Date Picker */}
                <div className="bg-white border border-[#804FE6] rounded-full shadow-sm min-w-[160px]">
                  <DatePickerCustom
                    name="CurrDate"
                    control={control}
                    defaultValue={searchCurrDate || workingDate}
                    label={intl.formatMessage({
                      id: "RowHeaderStarDate",
                    })}
                    error={!!errors.CurrDate}
                    register={register}
                    onFilterChange={(value) => {
                      setSearchCurrDate(value);
                    }}
                  />
                </div>
              </div>

            </div>

            {/* Status Legend */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Tooltip
                open={tooltipOpen}
                onClose={handleTooltipClose}
                onOpen={handleTooltipOpen}
                title={
                  <div className="p-4 max-w-xs">
                    <h4 className="font-semibold text-sm mb-3 pb-2 border-b border-gray-200">
                      {intl.formatMessage({ id: "TextRoomStatus" })}
                    </h4>
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
                      {(roomStatusData || []).filter((status: any) => {
                        const hideStatuses = ['StatusCancel', 'StatusUnconfirmReservation', 'StatusNoShow', 'StatusVoid'];
                        const statusCode = status.StatusCode || '';
                        const description = status.Description || '';
                        return statusCode.trim() !== '' && description.trim() !== '' && !hideStatuses.includes(statusCode);
                      }).map((status: any, index: number) => (
                        <React.Fragment key={index}>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: `#${status.StatusColor || 'cccccc'}` }}
                          />
                          <span className="text-gray-600">
                            {status.StatusCode ? intl.formatMessage({ id: status.StatusCode }, { defaultMessage: status.Description || status.StatusCode }) : (status.Description || status.StatusCode)}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                }
                arrow
                placement="left-end"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "white",
                      color: "black",
                      "& .MuiTooltip-arrow": {
                        color: "white",
                      },
                      boxShadow: "0 8px 16px 0 rgba(0,0,0,0.15)",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    },
                  },
                }}
              >
                <span
                  className="bg-[#804FE6] hover:bg-[#6B3BC0] text-white border-[#804FE6] rounded-full px-2 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltipOpen(!tooltipOpen);
                  }}
                >
                  <Iconify
                    icon="eva:info-outline"
                    width={20}
                    height={20}
                  />
                </span>
              </Tooltip>
              {/* View Period Controls */}
              <div className="bg-[#804FE6] rounded-full outline outline-[#804FE6] outline-2 shadow-md w-full sm:w-auto overflow-hidden">
                <RadioGroup
                  row
                  value={dayCount}
                  onChange={handleChange}
                  defaultValue={window.innerWidth < 950 ? 7 : 15}
                  className="flex gap-0.5 sm:gap-1 flex-nowrap"
                >
                  {[
                    { value: "hourly", label: <div className=""><Iconify icon="mdi:clock-outline" className="w-4 h-4" /></div> },
                    { value: 7, label: "7 хоног" },
                    { value: 15, label: "15 хоног" },
                    { value: 30, label: "30 хоног" },
                  ].map((period) => (
                    <FormControlLabel
                      key={period.value}
                      value={period.value}
                      control={
                        <Radio
                          sx={{
                            display: "none",
                          }}
                        />
                      }
                      label={period.label}
                      className={`
                      px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                      ${(dayCount === period.value) || (period.value === "hourly" && currentView === "resourceTimelineDay")
                          ? "bg-white text-[#804FE6] shadow-sm"
                          : "text-white hover:bg-white/10"
                        }
                    `}
                      sx={{
                        margin: 0,
                        minWidth: 'auto',
                        "& .MuiTypography-root": {
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          padding: 0,
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
        {/* <CustomSearch
                        listUrl={listUrl}
                        search={search}
                        setSearch={setSearch}
                        handleSubmit={handleSubmit}
                        reset={reset}
                        searchInitialState={{
                            CurrDate: workingDate,
                            NumberOfDays: dayCount,
                            RoomTypeID: 0,
                        }}
                        hideButtons={true}
                    >
                        <Search
                            register={register}
                            errors={errors}
                            control={control}
                            reset={reset}
                            workingDate={workingDate}
                            setSearchCurrDate={setSearchCurrDate}
                            setSearchRoomTypeID={setSearchRoomTypeID}
                        />
                    </CustomSearch> */}
        {/* <Typography variant="subtitle2" className="mt-2">
                    {format(timeStart, "yyyy/MM/dd ") + " - "}
                    {format(
                        moment(timeStart).add(dayCount, "days").toDate(),
                        "yyyy/MM/dd "
                    )}
                </Typography> */}
        <div
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #eff0f6",
          }}
        >
          {resources &&
            dayCount &&
            timeStart &&
            itemData &&
            rerenderKey && (
              <FullCalendar
                key={rerenderKey}
                plugins={[
                  resourceTimelinePlugin,
                  interactionPlugin,
                  timeGridPlugin,
                ]}
                initialView={currentView}
                resourceOrder="SortOrder"
                headerToolbar={{
                  left: "",
                  center: "",
                  right: "",
                }}
                viewDidMount={(info) => {
                  setCurrentView(info.view.type);
                }}
                resources={resources}
                initialDate={timeStart}
                events={itemData}
                selectable={true}
                select={handleSelect}
                editable={true}
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
                eventClick={handleEventClick}
                now={new Date(workingDate)}
                nowIndicator={true}
                height={height}
                allDaySlot={true}
                eventContent={eventContent}
                visibleRange={{
                  start: timeStart,
                  end: moment(timeStart)
                    .add(dayCount, "days")
                    .format("YYYY-MM-DD"),
                }}
                slotDuration={currentView === "resourceTimelineDay" ? "01:00:00" : "24:00:00"}
                slotLabelInterval={currentView === "resourceTimelineDay" ? { hours: 1 } : { hours: 24 }}
                slotMinTime={currentView === "resourceTimelineDay" ? "00:00:00" : "00:00:00"}
                slotMaxTime={currentView === "resourceTimelineDay" ? "24:00:00" : "24:00:00"}
                selectConstraint={{
                  start: "00:00:00",
                  end: "24:00:00"
                }}
                resourceAreaWidth={180}
                slotMinWidth={20}
                eventBackgroundColor="transparent"
                eventBorderColor="transparent"
                eventAllow={function (
                  dropInfo: any,
                  draggedEvent: any
                ) {
                  if (
                    areDatesOnSameDay(
                      dropInfo.start,
                      draggedEvent._instance.range.start
                    ) == false ||
                    new Date(workingDate) >
                    draggedEvent._instance.range.start
                  ) {
                    return true;
                  }
                  return true;
                }}
                views={{
                  timeline: {
                    type: "resourceTimeline",
                    duration: { days: dayCount },
                    dayHeaderContent: customHeader,
                    slotLabelContent: (arg: any) => {
                      arg.date.setHours(8);
                      var Difference_In_Time =
                        arg.date.getTime() -
                        timeStart.getTime();
                      var Difference_In_Days = Math.floor(
                        Difference_In_Time /
                        (1000 * 3600 * 24)
                      );
                      const day = arg.date.getDay();
                      const isWeekend =
                        day === 0 || day === 6;
                      // Get available rooms data from backend (fallback)
                      const availableRoomsKey = `D${Difference_In_Days + 1
                        }`;
                      const availableRoomsData =
                        availableRooms &&
                          availableRooms[0] &&
                          availableRooms[0][
                          availableRoomsKey
                          ]
                          ? availableRooms[0][
                            availableRoomsKey
                          ].split("/")
                          : ["0", "0"];

                      // Calculate corrected occupancy using reservation data
                      const currentDate = moment(arg.date).format("YYYY-MM-DD");
                      let correctedAvailableCount = parseInt(availableRoomsData[0]) || 0;
                      let correctedTotalCount = parseInt(availableRoomsData[1]) || 1;

                      // If we have reservation data, calculate accurate occupancy
                      if (reservationItems && resources) {
                        // Get all individual rooms (not room types)
                        const allRooms = resources.filter((resource: any) => resource.parentId);
                        correctedTotalCount = allRooms.length;

                        // Get occupied rooms for this date from reservations
                        const occupiedRoomsForDate = reservationItems.filter((item: any) => {
                          const startDate = moment(item.StartDate).format("YYYY-MM-DD");
                          const endDate = moment(item.DepartureDate).format("YYYY-MM-DD");
                          const isInDateRange = moment(currentDate).isBetween(startDate, endDate, "day", "[)");

                          // For day reservations (same start and departure date)
                          if (startDate === endDate && startDate === currentDate) {
                            // Day reservations (same arrival and departure date) should not count as occupied
                            return false;
                          }

                          return isInDateRange;
                        });

                        // Get blocked rooms for this date from room blocks
                        const blockedRoomsForDate = roomBlocks ? roomBlocks.filter((block: any) => {
                          const startDate = moment(block.BeginDate).format("YYYY-MM-DD");
                          const endDate = moment(block.EndDate).format("YYYY-MM-DD");
                          return moment(currentDate).isBetween(startDate, endDate, "day", "[)");
                        }) : [];

                        // Get unique occupied room IDs (reservations + room blocks)
                        const uniqueOccupiedRoomIds = new Set([
                          ...occupiedRoomsForDate.map((item: any) => item.RoomID),
                          ...blockedRoomsForDate.map((block: any) => block.RoomID)
                        ]);

                        correctedAvailableCount = correctedTotalCount - uniqueOccupiedRoomIds.size;
                      }

                      const occupancyPercentage =
                        Math.round(
                          ((correctedTotalCount -
                            correctedAvailableCount) /
                            correctedTotalCount) *
                          100
                        );

                      return arg.level == 1 ? (
                        <div
                          style={{
                            textAlign: "center",
                            fontWeight: "normal",
                            color: "#495057",
                          }}
                        >
                          <div className="text-xs">
                            {correctedAvailableCount} / {correctedTotalCount}
                          </div>
                        </div>
                      ) : (
                        <Tooltip
                          title={
                            <div
                              style={{
                                display: "flex",
                                flexDirection:
                                  "column",
                                gap: "8px",
                                padding: "4px",
                              }}
                            >
                              {/* Occupancy Percentage */}
                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "center",
                                  alignItems:
                                    "center",
                                }}
                              >
                                <div
                                  style={{
                                    display:
                                      "flex",
                                    fontSize:
                                      "12px",
                                    fontWeight:
                                      "bold",
                                    color:
                                      occupancyPercentage >
                                        80
                                        ? "#d32f2f"
                                        : occupancyPercentage >
                                          50
                                          ? "#ff9800"
                                          : "#4caf50",
                                    backgroundColor:
                                      "rgba(0,0,0,0.05)",
                                    padding:
                                      "2px 4px",
                                    borderRadius:
                                      "4px",
                                    whiteSpace:
                                      "nowrap",
                                    overflow:
                                      "hidden",
                                    textOverflow:
                                      "ellipsis",
                                    maxWidth:
                                      "auto",
                                  }}
                                >
                                  {
                                    occupancyPercentage
                                  }
                                  %
                                </div>
                                <div
                                  style={{
                                    fontWeight:
                                      "bold",
                                    marginBottom:
                                      "2px",
                                  }}
                                >
                                  {intl.formatMessage(
                                    {
                                      id: "TextFull",
                                    }
                                  )}
                                </div>
                              </div>

                              {/* Available Rooms */}
                              <div
                                style={{
                                  display:
                                    "flex",
                                  fontSize:
                                    "11px",
                                  justifyContent:
                                    "center",
                                  textAlign:
                                    "center",
                                  gap: "4px",
                                }}
                              >
                                <div
                                  style={{
                                    color:
                                      correctedAvailableCount >
                                        0
                                        ? "#4caf50"
                                        : "#d32f2f",
                                  }}
                                >
                                  {
                                    correctedAvailableCount
                                  }
                                </div>
                                <div
                                  style={{
                                    fontWeight:
                                      "bold",
                                    marginBottom:
                                      "2px",
                                  }}
                                >
                                  {intl.formatMessage(
                                    {
                                      id: "MenuReportAvailableRooms",
                                    }
                                  )}
                                </div>
                              </div>

                              {/* Room Type Available Rooms */}
                              {(() => {
                                if (
                                  resources &&
                                  reservationItems
                                ) {
                                  const currentDate =
                                    moment(
                                      arg.date
                                    ).format(
                                      "YYYY-MM-DD"
                                    );

                                  // Get room types (parent resources)
                                  const roomTypes =
                                    resources.filter(
                                      (
                                        resource: any
                                      ) =>
                                        !resource.parentId
                                    );

                                  // Calculate available rooms per room type
                                  const roomTypeAvailability =
                                    roomTypes.map(
                                      (
                                        roomType: any
                                      ) => {
                                        // Get all rooms for this room type
                                        const roomsForType =
                                          resources.filter(
                                            (
                                              resource: any
                                            ) =>
                                              resource.parentId ===
                                              roomType.id
                                          );

                                        // Get occupied rooms for this date and room type
                                        const occupiedRooms =
                                          reservationItems.filter(
                                            (
                                              item: any
                                            ) => {
                                              const startDate =
                                                moment(
                                                  item.StartDate
                                                ).format(
                                                  "YYYY-MM-DD"
                                                );
                                              const endDate =
                                                moment(
                                                  item.DepartureDate
                                                ).format(
                                                  "YYYY-MM-DD"
                                                );
                                              const isInDateRange =
                                                moment(
                                                  currentDate
                                                ).isBetween(
                                                  startDate,
                                                  endDate,
                                                  "day",
                                                  "[)"
                                                );

                                              let isOccupied = isInDateRange;

                                              // For day reservations (same start and departure date)
                                              if (startDate === endDate && startDate === currentDate) {
                                                // Day reservations (same arrival and departure date) should not count as occupied
                                                isOccupied = false;
                                              }

                                              return (
                                                isOccupied &&
                                                Number(
                                                  item.RoomTypeID
                                                ) ===
                                                Number(
                                                  roomType.id.split(
                                                    "?"
                                                  )[1]
                                                )
                                              );
                                            }
                                          );

                                        // Get blocked rooms for this room type and date
                                        const blockedRooms = roomBlocks ? roomBlocks.filter(
                                          (block: any) => {
                                            const startDate = moment(
                                              block.BeginDate
                                            ).format(
                                              "YYYY-MM-DD"
                                            );
                                            const endDate = moment(
                                              block.EndDate
                                            ).format(
                                              "YYYY-MM-DD"
                                            );
                                            const isBlocked =
                                              moment(
                                                currentDate
                                              ).isBetween(
                                                startDate,
                                                endDate,
                                                "day",
                                                "[)"
                                              );
                                            return (
                                              isBlocked &&
                                              Number(
                                                block.RoomTypeID
                                              ) ===
                                              Number(
                                                roomType.id.split(
                                                  "?"
                                                )[1]
                                              )
                                            );
                                          }
                                        ) : [];

                                        // Get unique room IDs to avoid counting the same room multiple times (reservations + blocks)
                                        const uniqueOccupiedRoomIds = new Set([
                                          ...occupiedRooms.map((item: any) => item.RoomID),
                                          ...blockedRooms.map((block: any) => block.RoomID)
                                        ]);

                                        const totalRooms =
                                          roomsForType.length;
                                        const availableRooms =
                                          totalRooms -
                                          uniqueOccupiedRoomIds.size;

                                        return {
                                          name: roomType.title,
                                          available:
                                            availableRooms,
                                          total: totalRooms,
                                        };
                                      }
                                    );

                                  return (
                                    <div
                                      style={{
                                        fontSize:
                                          "10px",
                                        borderTop:
                                          "1px solid #eee",
                                        paddingTop:
                                          "4px",
                                        marginTop:
                                          "4px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontWeight:
                                            "bold",
                                          marginBottom:
                                            "4px",
                                          fontSize:
                                            "11px",
                                        }}
                                      >
                                        {intl.formatMessage(
                                          {
                                            id: "TextRoomTypeAvailablity",
                                          }
                                        )}
                                      </div>
                                      {roomTypeAvailability.map(
                                        (
                                          roomType: any,
                                          index: number
                                        ) => (
                                          <div
                                            key={
                                              index
                                            }
                                            style={{
                                              display:
                                                "flex",
                                              justifyContent:
                                                "space-between",
                                              marginBottom:
                                                "2px",
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize:
                                                  "10px",
                                              }}
                                            >
                                              {
                                                roomType.name
                                              }

                                              :
                                            </span>
                                            <span
                                              style={{
                                                color:
                                                  roomType.available ===
                                                    0
                                                    ? "#d32f2f"
                                                    : roomType.available <=
                                                      roomType.total *
                                                      0.3
                                                      ? "#ff9800"
                                                      : roomType.available <=
                                                        roomType.total *
                                                        0.7
                                                        ? "#2196f3"
                                                        : "#4caf50",
                                                fontWeight:
                                                  "bold",
                                                fontSize:
                                                  "10px",
                                                backgroundColor:
                                                  roomType.available ===
                                                    0
                                                    ? "rgba(211, 47, 47, 0.1)"
                                                    : roomType.available <=
                                                      roomType.total *
                                                      0.3
                                                      ? "rgba(255, 152, 0, 0.1)"
                                                      : roomType.available <=
                                                        roomType.total *
                                                        0.7
                                                        ? "rgba(33, 150, 243, 0.1)"
                                                        : "rgba(76, 175, 80, 0.1)",
                                                padding:
                                                  "2px 4px",
                                                borderRadius:
                                                  "3px",
                                              }}
                                            >
                                              {
                                                roomType.available
                                              }

                                              /
                                              {
                                                roomType.total
                                              }
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  );
                                }
                                return null;
                              })()}

                              {/* Arrivals and Departures for Any Day */}
                              {(() => {
                                const currentDate =
                                  moment(
                                    arg.date
                                  ).format(
                                    "YYYY-MM-DD"
                                  );

                                if (
                                  reservationItems
                                ) {
                                  const arrivalsForDate =
                                    reservationItems.filter(
                                      (
                                        item: any
                                      ) =>
                                        moment(
                                          item.StartDate
                                        ).format(
                                          "YYYY-MM-DD"
                                        ) ===
                                        currentDate
                                    );

                                  const departuresForDate =
                                    reservationItems.filter(
                                      (
                                        item: any
                                      ) =>
                                        moment(
                                          item.DepartureDate
                                        ).format(
                                          "YYYY-MM-DD"
                                        ) ===
                                        currentDate
                                    );

                                  const guestArrivals =
                                    arrivalsForDate.reduce(
                                      (
                                        sum: number,
                                        item: any
                                      ) =>
                                        sum +
                                        (item.Adult ||
                                          0) +
                                        (item.Child ||
                                          0),
                                      0
                                    );
                                  const guestDepartures =
                                    departuresForDate.reduce(
                                      (
                                        sum: number,
                                        item: any
                                      ) =>
                                        sum +
                                        (item.Adult ||
                                          0) +
                                        (item.Child ||
                                          0),
                                      0
                                    );

                                  if (
                                    arrivalsForDate.length >
                                    0 ||
                                    departuresForDate.length >
                                    0
                                  ) {
                                    return (
                                      <div
                                        style={{
                                          fontSize:
                                            "11px",
                                          borderTop:
                                            "1px solid #eee",
                                          paddingTop:
                                            "4px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display:
                                              "flex",
                                            justifyContent:
                                              "space-between",
                                            marginBottom:
                                              "2px",
                                          }}
                                        >
                                          <span>
                                            {intl.formatMessage(
                                              {
                                                id: "TextGuestsArriving",
                                              }
                                            )}

                                            :
                                          </span>
                                          <span
                                            style={{
                                              color: "#4caf50",
                                              fontWeight:
                                                "bold",
                                            }}
                                          >
                                            {
                                              guestArrivals
                                            }
                                          </span>
                                        </div>

                                        <div
                                          style={{
                                            display:
                                              "flex",
                                            justifyContent:
                                              "space-between",
                                            marginBottom:
                                              "2px",
                                          }}
                                        >
                                          <span>
                                            {intl.formatMessage(
                                              {
                                                id: "TextGuestsDeparting",
                                              }
                                            )}

                                            :
                                          </span>
                                          <span
                                            style={{
                                              color: "#ff9800",
                                              fontWeight:
                                                "bold",
                                            }}
                                          >
                                            {
                                              guestDepartures
                                            }
                                          </span>
                                        </div>

                                        <div
                                          style={{
                                            display:
                                              "flex",
                                            justifyContent:
                                              "space-between",
                                            marginBottom:
                                              "2px",
                                          }}
                                        >
                                          <span>
                                            {intl.formatMessage(
                                              {
                                                id: "TextRoomsArriving",
                                              }
                                            )}

                                            :
                                          </span>
                                          <span
                                            style={{
                                              color: "#4caf50",
                                              fontWeight:
                                                "bold",
                                            }}
                                          >
                                            {
                                              arrivalsForDate.length
                                            }
                                          </span>
                                        </div>

                                        <div
                                          style={{
                                            display:
                                              "flex",
                                            justifyContent:
                                              "space-between",
                                          }}
                                        >
                                          <span>
                                            {intl.formatMessage(
                                              {
                                                id: "TextRoomsDeparting",
                                              }
                                            )}

                                            :
                                          </span>
                                          <span
                                            style={{
                                              color: "#ff9800",
                                              fontWeight:
                                                "bold",
                                            }}
                                          >
                                            {
                                              departuresForDate.length
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                                return null;
                              })()}
                            </div>
                          }
                        >
                          <div
                            style={{
                              fontSize:
                                dayCount > 7
                                  ? "14px"
                                  : "13px",
                              padding:
                                dayCount > 7
                                  ? "2px"
                                  : "4px",
                              backgroundColor:
                                isWeekend
                                  ? "#fff9c4"
                                  : "#f8f9fa",
                              borderRadius: "4px",
                              height: "100%",
                            }}
                          >
                            <div
                              className="flex gap-5"
                              style={{
                                flexDirection:
                                  dayCount > 7
                                    ? "column"
                                    : "row",
                                justifyContent:
                                  dayCount ===
                                    7
                                    ? "space-between"
                                    : "",
                                alignContent:
                                  "center",
                                alignItems:
                                  dayCount ===
                                    7
                                    ? "center"
                                    : "",
                                gap:
                                  dayCount > 7
                                    ? "2px"
                                    : "5px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight:
                                    "500",
                                  textAlign:
                                    "center",
                                  color: isWeekend
                                    ? "#ff9800"
                                    : "#4a6cf7", // Different color for weekends
                                  textTransform:
                                    "uppercase",
                                  fontSize:
                                    dayCount >
                                      7
                                      ? dayCount >
                                        15
                                        ? "10px"
                                        : "14px"
                                      : "16px",
                                  whiteSpace:
                                    "nowrap",
                                  overflow:
                                    "hidden",
                                  textOverflow:
                                    "ellipsis",
                                  maxWidth:
                                    dayCount >
                                      7
                                      ? "100%"
                                      : "auto",
                                  minWidth:
                                    dayCount >
                                      7
                                      ? "100%"
                                      : "auto",
                                  width: "100%",
                                  display:
                                    "flex",
                                  justifyContent:
                                    dayCount ===
                                      30 ||
                                      dayCount ===
                                      15
                                      ? "center"
                                      : "",
                                  alignItems:
                                    "center",
                                }}
                              >
                                {
                                  arg.date
                                    .toString()
                                    .split(
                                      " "
                                    )[0]
                                }
                              </div>

                              <div
                                style={{
                                  fontWeight:
                                    "bold",
                                  textAlign:
                                    "center",
                                  fontSize:
                                    dayCount >
                                      7
                                      ? dayCount >
                                        15
                                        ? "12px"
                                        : "14px"
                                      : "18px",
                                  color: "#212529",
                                }}
                              >
                                {arg.date.getDate()}
                              </div>
                            </div>
                          </div>
                        </Tooltip>
                      );
                    },
                  },
                  resourceTimeline: {
                    dayHeaderContent: customHeader,
                  },
                  timeGridDay: {
                    type: "timeGrid",
                    duration: { days: 1 },
                    slotMinTime: "06:00:00",
                    slotMaxTime: "24:00:00",
                    slotDuration: "01:00:00",
                    slotLabelInterval: "01:00:00",
                    allDaySlot: true,
                    nowIndicator: true,
                  },
                  resourceTimelineDay: {
                    type: "resourceTimeline",
                    duration: { days: 1 },
                    slotMinTime: "00:00:00",
                    slotMaxTime: "24:00:00",
                    slotDuration: "01:00:00",
                    slotLabelInterval: "01:00:00",
                    slotLabelFormat: {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    },
                    resourceAreaWidth: 180,
                    nowIndicator: true,
                    slotLabelContent: (arg: any) => {
                      return (
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#666",
                            textAlign: "center",
                            padding: "4px 2px",
                          }}
                        >
                          {arg.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                          })}
                        </div>
                      );
                    },
                    dayHeaderContent: (arg: any) => {
                      const day = arg.date.getDay();
                      const isWeekend = day === 0 || day === 6;
                      const monthNames = [
                        intl.formatMessage({ id: "January" }) || "January",
                        intl.formatMessage({ id: "February" }) || "February",
                        intl.formatMessage({ id: "March" }) || "March",
                        intl.formatMessage({ id: "April" }) || "April",
                        intl.formatMessage({ id: "May" }) || "May",
                        intl.formatMessage({ id: "June" }) || "June",
                        intl.formatMessage({ id: "July" }) || "July",
                        intl.formatMessage({ id: "August" }) || "August",
                        intl.formatMessage({ id: "September" }) || "September",
                        intl.formatMessage({ id: "October" }) || "October",
                        intl.formatMessage({ id: "November" }) || "November",
                        intl.formatMessage({ id: "December" }) || "December",
                      ];
                      const monthName = monthNames[arg.date.getMonth()];

                      return (
                        <div
                          style={{
                            padding: "8px",
                            backgroundColor: isWeekend ? "#ffd700" : "#f8f9fa",
                            borderRadius: "6px",
                            textAlign: "center",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: isWeekend ? "#ff9800" : "#4a6cf7",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            {arg.date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "#212529",
                              marginBottom: "2px",
                            }}
                          >
                            {arg.date.getDate()}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                            }}
                          >
                            {monthName}
                          </div>
                        </div>
                      );
                    },
                  },
                }}
              />
            )}
        </div>

        {/* Search Modal moved to dashboard navbar */}
      </>
    )
  );
};

export default MyCalendar;
