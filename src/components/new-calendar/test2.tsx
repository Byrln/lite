import React, { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import {
    Tooltip,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Box,
    Button,
    Typography,
    Checkbox,
    IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { RoomTypeAPI } from "lib/api/room-type";
import { RoomAPI } from "lib/api/room";
import { ReservationAPI } from "lib/api/reservation";
import { StayView2API } from "lib/api/stay-view2";
import { FrontOfficeAPI, listUrl } from "lib/api/front-office";
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
import DatePickerCustom from "../ui/date-picker-custom";
import { da } from "date-fns/locale";
import Image from "next/image";

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
    const [isHoverEnabled, setIsHoverEnabled] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

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
        const isWeekend = day === 0 || day === 6; // 0 is Sunday, 6 is Saturday

        // Get month name from the date
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
                    backgroundColor: isWeekend ? "#fff9c4" : "#f8f9fa", // Yellow for weekends
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
    const [reservationItems, setReservationItems] = useState<any>(null);

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

                const roomBlocks: any = await RoomBlockAPI?.list({
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
                        console.log("obj", obj);
                        return obj.RoomID
                            ? {
                                  id: obj.TransactionID,
                                  title: obj.GuestName,
                                  start: obj.StartDate,
                                  end: obj.DepartureDate,
                                  resourceId: obj.RoomID
                                      ? obj.RoomID
                                      : `${obj.RoomTypeName}-${obj.RoomTypeID}`,
                                  roomTypeID: obj.RoomTypeID,
                                  transactionID: obj.TransactionID,
                                  startDate: obj.StartDate,
                                  departureDate: obj.DepartureDate,
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
                                  endDate: obj.EndDate,
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
                                  start: obj.StartDate,
                                  end: obj.EndDate,
                                  resourceId: `${obj.RoomTypeName}?${obj.RoomTypeID}`,
                                  roomTypeID: obj.RoomTypeID,
                                  transactionID: obj.TransactionID,
                                  startDate: obj.StartDate,
                                  endDate: obj.EndDate,
                                  statusColor: `#${obj.StatusColor}`,
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
                                id: `${level2.resourceId}-${index}`,
                                title: level2.count,
                                start: `${level2.date} 00:00:00`,
                                end: `${level2.date} 23:59:59`,
                                resourceId: level2.resourceId,
                                startDate: `${level2.date} 00:00:00`,
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

                    if (roomBlocks) {
                        const newRoomBlockDta = roomBlocks.map((obj: any) => {
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
                                        id: `${obj.TransactionID}_checkout`,
                                        title: "Checked Out",
                                        start: obj.StartDate,
                                        end: obj.EndDate,
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
            await setDayCount(Number(event.target.value));
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
        setHeight(window.innerHeight - 30);
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
            const newEventObject = {
                title: "New Event",
                ArrivalDate: info.event._instance.range.start,
                DepartureDate: info.event._instance.range.end,
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
            const newEventObject = {
                title: "New Event",
                ArrivalDate: info.event._instance.range.start,
                DepartureDate: info.event._instance.range.end,
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
                    `New Reservation`,
                    <NewReservation
                        dateStart={start}
                        dateEnd={end}
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
                                    style={{ color: "rgba(255,255,255,0.7)" }}
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

                                <span
                                    style={{ color: "rgba(255,255,255,0.7)" }}
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
                                    {Number(
                                        arg.event._def.extendedProps.Balance
                                    ).toLocaleString()}
                                    ₮
                                </span>

                                <span
                                    style={{ color: "rgba(255,255,255,0.7)" }}
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
                    className={`event-custom ${
                        isHoverEnabled
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
                                }}
                            >
                                <Iconify
                                    icon="mdi:clock-outline"
                                    width="12px"
                                    style={{ marginRight: "4px" }}
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
                <Box
                    className="mb-8 overflow-hidden gap-2"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: "10px", md: "0" },
                        "@media (max-width: 900px)": {
                            flexDirection: "column",
                            gap: "10px",
                            width: "100%",
                            padding: "0 8px",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: { xs: "wrap", md: "nowrap" },
                            gap: "8px",
                            width: { xs: "100%", md: "auto" },
                            justifyContent: {
                                xs: "space-between",
                                sm: "flex-start",
                            },
                        }}
                    >
                        <Button
                            style={{ borderRadius: "20px", height: "35px" }}
                            variant="contained"
                            className="whitespace-nowrap px-8"
                            onClick={() => {
                                dispatch({
                                    type: "editId",
                                    editId: null,
                                });
                                handleModal(
                                    true,
                                    `Захиалга нэмэх`,
                                    <NewReservation
                                        workingDate={workingDate}
                                    />,
                                    null,
                                    "medium"
                                );
                            }}
                            startIcon={
                                <Icon
                                    style={{ color: "white" }}
                                    icon={plusFill}
                                />
                            }
                            sx={{
                                fontSize: { xs: "10px", md: "12px" },
                                padding: { xs: "6px 10px", md: "6px 16px" },
                                width: "auto",
                            }}
                        >
                            {intl.formatMessage({
                                id: "FrontNewReservation",
                            })}
                        </Button>
                        <IconButton
                            style={{ height: "35px" }}
                            className="whitespace-nowrap"
                            onClick={() => {
                                setIsCalendarLoading(true);
                                setRerenderKey((prevKey) => prevKey + 1);
                                // Reset loading state after a short delay to allow calendar to render
                                setTimeout(() => {
                                    setIsCalendarLoading(false);
                                }, 1000);
                            }}
                            disabled={isCalendarLoading}
                        >
                            <Image
                                src="/images/logo_sm.png"
                                alt="Refresh"
                                width={24}
                                height={16}
                            />
                        </IconButton>
                        <Box
                            className="flex px-2 items-center justify-center"
                            sx={{
                                borderRadius: "20px",
                                border: "1px solid #000000",
                                height: "35px",
                                minWidth: { xs: "80px", md: "auto" },
                                width: "auto",
                            }}
                        >
                            <Checkbox
                                checked={isHoverEnabled}
                                onChange={handleHoverChange}
                                sx={{
                                    padding: "0px",
                                    paddingX: "3px",
                                    color: "#000000",
                                    "&.Mui-checked": {
                                        color: "#333333",
                                    },
                                    "& .MuiSvgIcon-root": { fontSize: 18 },
                                }}
                            />
                            <Typography
                                className="text-black font-bold"
                                sx={{
                                    fontSize: { xs: "14px", md: "16px" },
                                    "@media (min-width: 600px) and (max-width: 1024px)":
                                        {
                                            fontSize: "14px",
                                        },
                                }}
                            >
                                Hover
                            </Typography>
                        </Box>
                        <div className="flex gap-3">
                            <Box
                                className="flex px-2 items-center justify-center"
                                sx={{
                                    borderRadius: "20px",
                                    border: "1px solid #000000",
                                    height: "35px",
                                    flexGrow: { xs: 1, sm: 1, md: 0 },
                                    minWidth: { xs: "80px", md: "auto" },
                                    width: "auto",
                                }}
                            >
                                <RoomTypeCustomSelect
                                    searchRoomTypeID={searchRoomTypeID}
                                    setSearchRoomTypeID={setSearchRoomTypeID}
                                />
                            </Box>
                            <Box
                                className="flex px-2 items-center justify-center"
                                sx={{
                                    borderRadius: "20px",
                                    border: "1px solid #000000",
                                    height: "35px",
                                    flexGrow: { xs: 1, sm: 1, md: 0 },
                                    minWidth: { xs: "80px", md: "auto" },
                                    width: "auto",
                                }}
                            >
                                <DatePickerCustom
                                    name="CurrDate"
                                    control={control}
                                    defaultValue={searchCurrDate || workingDate}
                                    label={intl.formatMessage({
                                        id: "RowHeaderStarDate",
                                    })}
                                    error={errors.CurrDate}
                                    register={register}
                                    onFilterChange={(value) => {
                                        setSearchCurrDate(value);
                                    }}
                                />
                            </Box>
                        </div>
                    </Box>
                    <Box
                        className="flex gap-2 items-center"
                        sx={{
                            width: { xs: "100%", md: "auto" },
                            justifyContent: { xs: "center", md: "flex-start" },
                            marginTop: { xs: "10px", md: 0 },
                            "@media (min-width: 600px) and (max-width: 900px)":
                                {
                                    justifyContent: "center",
                                    marginTop: "10px",
                                },
                        }}
                    >
                        {/* Add state to control tooltip visibility */}
                        {(() => {
                            return (
                                <Tooltip
                                    open={tooltipOpen}
                                    onClose={handleTooltipClose}
                                    onOpen={handleTooltipOpen}
                                    title={
                                        <div
                                            style={{
                                                padding: "12px",
                                                width: "fit-content",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: "14px",
                                                    marginBottom: "8px",
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.1)",
                                                    paddingBottom: "6px",
                                                }}
                                            >
                                                Статусын төрлүүд
                                            </div>
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "auto 1fr",
                                                    gap: "6px 12px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: 500,
                                                        backgroundColor:
                                                            "#1281b0",
                                                        borderRadius: "12px",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: "rgba(255,255,255,0.7)",
                                                    }}
                                                >
                                                    Ирсэн
                                                </span>
                                                <span
                                                    style={{
                                                        fontWeight: 500,
                                                        backgroundColor:
                                                            "#b0531e",
                                                        borderRadius: "12px",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: "rgba(255,255,255,0.7)",
                                                    }}
                                                >
                                                    Гарсан
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: 500,
                                                        backgroundColor:
                                                            "#94d8f6",
                                                        borderRadius: "12px",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: "rgba(255,255,255,0.7)",
                                                    }}
                                                >
                                                    Гарах
                                                </span>
                                                <span
                                                    style={{
                                                        fontWeight: 500,
                                                        backgroundColor:
                                                            "#57fa71",
                                                        borderRadius: "12px",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: "rgba(255,255,255,0.7)",
                                                    }}
                                                >
                                                    Баталгаажсан
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: 500,
                                                        backgroundColor:
                                                            "black",
                                                        borderRadius: "12px",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: "rgba(255,255,255,0.7)",
                                                    }}
                                                >
                                                    Блок
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: 500,
                                                        backgroundColor:
                                                            "#0033ff",
                                                        borderRadius: "12px",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: "rgba(255,255,255,0.7)",
                                                    }}
                                                >
                                                    Дахин хонох
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: 500,
                                                        backgroundColor:
                                                            "#009933",
                                                        borderRadius: "12px",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: "rgba(255,255,255,0.7)",
                                                    }}
                                                >
                                                    Өдрөөр захиалга
                                                </span>
                                                <span
                                                    style={{
                                                        backgroundColor:
                                                            "#212b36",
                                                        width: "20px",
                                                        height: "0px",
                                                        borderRadius: "12px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#212b36",
                                                        }}
                                                    >
                                                        g
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    }
                                    arrow
                                    placement="left-end"
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: "#212B36",
                                                "& .MuiTooltip-arrow": {
                                                    color: "#212B36",
                                                },
                                                boxShadow:
                                                    "0 8px 16px 0 rgba(0,0,0,0.2)",
                                                borderRadius: "8px",
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            cursor: "pointer",
                                            backgroundColor: "#804FE6",
                                            borderRadius: "50%",
                                            width: "32px",
                                            height: "32px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            zIndex: 1000,
                                        }}
                                        onClick={(e) => {
                                            // Toggle tooltip visibility on click
                                            e.stopPropagation();
                                            setTooltipOpen(!tooltipOpen);
                                        }}
                                    >
                                        <Iconify
                                            icon="eva:info-outline"
                                            width={20}
                                            height={20}
                                            color="white"
                                        />
                                    </Box>
                                </Tooltip>
                            );
                        })()}
                        <FormControl
                            sx={{
                                backgroundColor: "#804FE6",
                                borderRadius: "20px",
                                height: "35px",
                                alignItems: "center",
                                justifyContent: "center",
                                alignSelf: { xs: "center", md: "flex-start" },
                                width: { xs: "100%", md: "auto" },
                                maxWidth: { xs: "500px", md: "auto" },
                                position: "relative",
                                "@media (min-width: 600px) and (max-width: 1024px)":
                                    {
                                        width: "100%",
                                        margin: "0",
                                        minWidth: "unset",
                                    },
                            }}
                        >
                            <RadioGroup
                                row
                                aria-labelledby="radio-group-plan"
                                value={dayCount}
                                onChange={handleChange}
                                defaultValue={window.innerWidth < 950 ? 7 : 15}
                                sx={{
                                    "& .MuiFormControlLabel-root": {
                                        margin: 0,
                                        "@media (min-width: 600px) and (max-width: 900px)":
                                            {
                                                margin: "0 2px",
                                            },
                                    },
                                    justifyContent: "center",
                                    "@media (min-width: 600px) and (max-width: 1024px)":
                                        {
                                            flexWrap: "nowrap",
                                            width: "100%",
                                            justifyContent: "space-between",
                                        },
                                }}
                            >
                                <FormControlLabel
                                    value={7}
                                    control={
                                        <Radio
                                            sx={{
                                                color: "white",
                                                "&.Mui-checked": {
                                                    color: "white",
                                                },
                                                padding: {
                                                    xs: "4px",
                                                    sm: "8px",
                                                },
                                                "@media (min-width: 600px) and (max-width: 1024px)":
                                                    {
                                                        padding: "4px",
                                                    },
                                            }}
                                        />
                                    }
                                    label="7 хоног"
                                    sx={{
                                        padding: { xs: "4px", sm: "8px 4px" },
                                        transition: "all 0.2s",
                                        color: "white",
                                        "@media (min-width: 600px) and (max-width: 1024px)":
                                            {
                                                padding: "4px 2px",
                                            },
                                        "& .MuiTypography-root": {
                                            fontSize: {
                                                xs: "0.75rem",
                                                sm: "0.875rem",
                                            },
                                            fontWeight: 500,
                                            "@media (min-width: 600px) and (max-width: 1024px)":
                                                {
                                                    fontSize: "0.75rem",
                                                },
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    value={15}
                                    control={
                                        <Radio
                                            sx={{
                                                color: "white",
                                                "&.Mui-checked": {
                                                    color: "white",
                                                },
                                                padding: {
                                                    xs: "4px",
                                                    sm: "8px",
                                                },
                                                "@media (min-width: 600px) and (max-width: 1024px)":
                                                    {
                                                        padding: "4px",
                                                    },
                                            }}
                                        />
                                    }
                                    label="15 хоног"
                                    sx={{
                                        padding: { xs: "4px", sm: "8px 12px" },
                                        transition: "all 0.2s",
                                        color: "white",
                                        "@media (min-width: 600px) and (max-width: 1024px)":
                                            {
                                                padding: "4px 2px",
                                            },
                                        "& .MuiTypography-root": {
                                            fontSize: {
                                                xs: "0.75rem",
                                                sm: "0.875rem",
                                            },
                                            fontWeight: 500,
                                            "@media (min-width: 600px) and (max-width: 1024px)":
                                                {
                                                    fontSize: "0.75rem",
                                                },
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    value={30}
                                    control={
                                        <Radio
                                            sx={{
                                                color: "white",
                                                "&.Mui-checked": {
                                                    color: "white",
                                                },
                                                padding: {
                                                    xs: "4px",
                                                    sm: "8px",
                                                },
                                                "@media (min-width: 600px) and (max-width: 1024px)":
                                                    {
                                                        padding: "4px",
                                                    },
                                            }}
                                        />
                                    }
                                    label="30 хоног"
                                    sx={{
                                        padding: { xs: "4px", sm: "8px 12px" },
                                        transition: "all 0.2s",
                                        color: "white",
                                        "@media (min-width: 600px) and (max-width: 1024px)":
                                            {
                                                padding: "4px 2px",
                                            },
                                        "& .MuiTypography-root": {
                                            fontSize: {
                                                xs: "0.75rem",
                                                sm: "0.875rem",
                                            },
                                            fontWeight: 500,
                                            "@media (min-width: 600px) and (max-width: 1024px)":
                                                {
                                                    fontSize: "0.75rem",
                                                },
                                        },
                                    }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>
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
                                ]}
                                initialView="resourceTimeline"
                                resourceOrder="SortOrder"
                                headerToolbar={{
                                    left: "",
                                    center: "title",
                                    right: "today",
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
                                eventContent={eventContent}
                                visibleRange={{
                                    start: timeStart,
                                    end: moment(timeStart)
                                        .add(dayCount, "days")
                                        .format("YYYY-MM-DD"),
                                }}
                                slotDuration="24:00:00"
                                slotLabelInterval={{ hours: 24 }}
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
                                            // Get available rooms data
                                            const availableRoomsKey = `D${
                                                Difference_In_Days + 1
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

                                            // Calculate occupancy percentage
                                            const availableCount =
                                                parseInt(
                                                    availableRoomsData[0]
                                                ) || 0;
                                            const totalCount =
                                                parseInt(
                                                    availableRoomsData[1]
                                                ) || 1; // Prevent division by zero
                                            const occupancyPercentage =
                                                Math.round(
                                                    ((totalCount -
                                                        availableCount) /
                                                        totalCount) *
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
                                                        {availableCount} /{" "}
                                                        {totalCount}
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
                                                                            availableCount >
                                                                            0
                                                                                ? "#4caf50"
                                                                                : "#d32f2f",
                                                                    }}
                                                                >
                                                                    {
                                                                        availableCount
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
                                                                                            const isOccupied =
                                                                                                moment(
                                                                                                    currentDate
                                                                                                ).isBetween(
                                                                                                    startDate,
                                                                                                    endDate,
                                                                                                    "day",
                                                                                                    "[)"
                                                                                                );
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

                                                                                const totalRooms =
                                                                                    roomsForType.length;
                                                                                const availableRooms =
                                                                                    totalRooms -
                                                                                    occupiedRooms.length;

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
                                }}
                            />
                        )}
                </div>
            </>
        )
    );
};

export default MyCalendar;
