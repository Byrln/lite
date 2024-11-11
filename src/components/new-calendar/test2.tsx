import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction"; // Import the interaction plugin
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { mutate } from "swr";
import {
    Tooltip,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Box,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Stack,
} from "@mui/material";
import { format } from "date-fns";
import { toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info";
import { useRouter } from "next/router";

import { RoomTypeSWR } from "../../lib/api/room-type";
import { RoomSWR } from "lib/api/room";
import { StayView2SWR } from "lib/api/stay-view2";
import { FrontOfficeSWR, listUrl } from "lib/api/front-office";
import NewReservation from "components/front-office/reservation-list/new";
import { ModalContext } from "lib/context/modal";
import { RoomBlockSWR } from "lib/api/room-block";
import { dateToCustomFormat } from "lib/utils/format-time";
import { useAppState } from "lib/context/app";
import Search from "./search";
import CustomSearch from "components/common/custom-search";
import ReservationEdit from "components/front-office/reservation-list/edit";
import RoomMoveForm from "components/reservation/room-move";
import AmendStayForm from "components/reservation/amend-stay";
import RoomAssignGroup from "components/reservation/room-assign-group";
import Iconify from "components/iconify/iconify";
import { getContrastYIQ } from "lib/utils/helpers";
import { useIntl } from "react-intl";

const MyCalendar: React.FC = ({ workingDate }: any) => {
    const intl = useIntl();

    const router = useRouter();
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
    // const [activeSessionID, setActiveSessionID] = useState<any>(null);

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
        const dateText = info.currentRange.start.toISOString().slice(0, 10);
        return (
            <div>
                <div>{info.dayHeader.text}</div>
                <div>{dateText}</div>
            </div>
        );
    };

    const {
        data: items,
        mutate: mutateItems,
        error: itemsError,
    } = FrontOfficeSWR({
        CurrDate: searchCurrDate ? searchCurrDate : workingDate,
        NumberOfDays: dayCount,
        RoomTypeID: searchRoomTypeID,
    });
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

    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR({
        RoomTypeID: searchRoomTypeID,
    });
    const { data: rooms, error: roomSwrError } = RoomSWR({});
    // const { data: listData, error: listError } = CashierSessionListSWR({});

    // const { data: cashierActive, error: cashierActiveError } =
    //     CashierSessionActiveSWR();

    const { data: roomBlocks, error: roomBlocksError } = RoomBlockSWR({
        //@ts-ignore
        StartDate: dateToCustomFormat(timeStart, "yyyy-MM-dd"),
        EndDate: dateToCustomFormat(timeEnd, "yyyy-MM-dd"),
    });
    const [resources, setResources] = useState<any>(null);
    const [itemData, setItemData] = useState<any>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [height, setHeight] = useState<any>(null);
    const { data: availableRooms, error: availableRoomsError } = StayView2SWR(
        searchCurrDate ? searchCurrDate : workingDate,
        dayCount
    );

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

    useEffect(() => {
        (async () => {
            try {
                if (searchCurrDate == "Invalid date") {
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

                await mutate("/api/RoomBlock/List");
                await mutate("/api/RoomType/List");
                await mutate("/api/FrontOffice/StayView2");
                await mutate("/api/FrontOffice/ReservationDetailsByDate");
                setRerenderKey((prevKey) => prevKey + 1);
            } finally {
            }
        })();
    }, [searchCurrDate, searchRoomTypeID]);

    const handleChange = async (event: any) => {
        try {
            await setDayCount(Number(event.target.value));
            await mutate("/api/RoomBlock/List");
            await mutate("/api/RoomType/List");
            await mutate("/api/FrontOffice/StayView2");
            await mutate("/api/FrontOffice/ReservationDetailsByDate");
        } finally {
        }
    };

    const groupEventsByDate = (events: any) => {
        const groupedEvents: any = {};

        events.forEach((event: any) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            const resourceId = event.resourceId;

            let currentDate = new Date(startDate); // Create a copy of startDate

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
                return obj.RoomID
                    ? {
                          id: obj.TransactionID,
                          title: obj.GuestName,
                          start: obj.StartDate,
                          end: obj.EndDate,
                          resourceId: obj.RoomID
                              ? obj.RoomID
                              : `${obj.RoomTypeName}-${obj.RoomTypeID}`,
                          roomTypeID: obj.RoomTypeID,
                          transactionID: obj.TransactionID,
                          startDate: obj.StartDate,
                          GroupID: obj.GroupID,
                          Balance: obj.Balance,
                          Breakfast: obj.Breakfast,
                          endDate: obj.EndDate,
                          groupColor: `${obj.GroupColor}`,
                          statusColor: `#${obj.StatusColor}`,
                          editable: true,
                          color: getContrastYIQ(`#${obj.StatusColor}`),
                          textColor: getContrastYIQ(`#${obj.StatusColor}`),
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
                          editable: true,
                          color: getContrastYIQ(`#${obj.StatusColor}`),
                          textColor: getContrastYIQ(`#${obj.StatusColor}`),
                          border: "none",
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
            console.log("letNewEvents", letNewEvents);

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
                // Concatenate the room blocks first
                itemDataConcated = itemDataConcated.concat(newRoomBlockDta);
            }
        }

        for (let i = 0; i < dayCount; i++) {
            const currentDate = new Date(new Date(searchCurrDate).getTime());
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

        // Concatenate roomTypesObj and newItemDta
        itemDataConcated = itemDataConcated
            .concat(newItemDta)
            .concat(roomTypesObj);
        setItemData(itemDataConcated);
        setRerenderKey((prevKey) => prevKey + 1);
    }, [items, dayCount]);

    useEffect(() => {
        if (rooms && roomTypes) {
            const newRoomTypeData = roomTypes.map((obj: any) => {
                return {
                    id: `${obj.RoomTypeName}?${obj.RoomTypeID}`,
                    title: obj.RoomTypeName,
                    SortOrder: obj.SortOrder,
                };
            });
            const newData = rooms
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
                        SortOrder: Number(obj.RoomNo),
                    };
                });

            setResources(newRoomTypeData.concat(newData));
        }
    }, [roomTypes, rooms]);

    useEffect(() => {
        setHeight(window.innerHeight - 200);
    }, [window.innerHeight]);

    // const fetchTest = async () => {
    //     if (listData) {
    //         let filteredItemData = listData.filter(
    //             (event: any) => event.IsActive === true
    //         );
    //         if (filteredItemData && filteredItemData.length) {
    //             setActiveSessionID(listData[0].SessionID);
    //         } else {
    //             setActiveSessionID("-1");
    //         }
    //     }
    // };

    // useEffect(() => {
    //     fetchTest();
    // }, [listData]);

    const handleEventClick = (info: any) => {
        if (
            // info.event._instance.range.end > new Date(workingDate) &&
            info.event._def.title != "Blocked"
        ) {
            // activeSessionID && activeSessionID == "-1" && handleCashierOpen();

            if (info.event._def.extendedProps.entities) {
                handleModal(
                    true,
                    intl.formatMessage({
                        id: "ButtonAssignRoom",
                    }),
                    <RoomAssignGroup
                        entities={info.event._def.extendedProps.entities}
                        additionalMutateUrl="/api/Reservation/List"
                        customRerender={setRerenderKey(
                            (prevKey) => prevKey + 1
                        )}
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
                    />,
                    null,
                    "medium"
                );
            }
        }
    };

    const handleEventDrop = (info: any) => {
        // if (info.event._instance.range.end > new Date(workingDate)) {
        console.log("info", info);

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

            if (filteredItemData.length > 0) {
                toast("Захиалга давхцаж байна.");
            } else {
                handleModal(
                    true,
                    intl.formatMessage({
                        id: "ButtonAmendStay",
                    }),
                    <AmendStayForm
                        transactionInfo={newEventObject}
                        reservation={newEventObject}
                        additionalMutateUrl="/api/Reservation/List"
                    />,
                    false,
                    "small"
                );
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
                    handleModal(
                        true,
                        `Room move`,
                        <RoomMoveForm
                            transactionInfo={newEventObject}
                            additionalMutateUrl="/api/Reservation/List"
                            customRerender={setRerenderKey(
                                (prevKey) => prevKey + 1
                            )}
                        />,
                        null,
                        "small"
                    );
                }
            }
        }
        // }
    };

    const handleEventResize = async (info: any) => {
        // if (info.event._instance.range.end > new Date(workingDate)) {
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
            handleModal(
                true,
                "Amend Stay",
                <AmendStayForm
                    transactionInfo={newEventObject}
                    reservation={newEventObject}
                    additionalMutateUrl="/api/Reservation/List"
                />,
                false,
                "small"
            );
        }
        setRerenderKey((prevKey) => prevKey + 1);
        // }
    };

    const handleSelect = (info: any) => {
        const { start, end, resourceId } = info;
        dispatch({
            type: "editId",
            editId: "",
        });

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

        // activeSessionID && activeSessionID == "-1" && handleCashierOpen();

        if (newEventObject.roomID) {
            handleModal(
                true,
                `New Reservation`,
                <NewReservation
                    dateStart={start}
                    dateEnd={end}
                    // // @ts-ignore
                    roomType={newEventObject.roomTypeID}
                    // // @ts-ignore
                    room={newEventObject.roomID}
                    BaseAdult={newEventObject.BaseAdult}
                    BaseChild={newEventObject.BaseChild}
                    MaxAdult={newEventObject.MaxAdult}
                    MaxChild={newEventObject.MaxChild}
                    workingDate={workingDate}
                />,
                null,
                "medium"
            );
        }
    };

    const [cashierOpen, setCashierOpen] = useState(false);

    const handleCashierOpen = () => {
        setCashierOpen(true);
    };

    const handleCashierClose = async () => {
        handleModal();
        setCashierOpen(false);
        router.replace("/payment/cashier");
    };

    const eventContent = (arg: any) => {
        // Customize the content and styles of each event
        console.log("testestsetes", arg.event._def.extendedProps);
        return (
            <Tooltip
                title={
                    arg.event._def.extendedProps.statusColor ==
                    "rgba(255, 220, 40, 0.15)" ? (
                        <div>Unassigned Rooms : {arg.event.title}</div>
                    ) : arg.event.title == "Blocked" ? (
                        <div>Blocked</div>
                    ) : (
                        <div>
                            <div> Name : {arg.event.title}</div>
                            <div>
                                Balance : {arg.event._def.extendedProps.Balance}
                            </div>
                            <div>
                                Breakfast :{" "}
                                {arg.event._def.extendedProps.Breakfast &&
                                arg.event._def.extendedProps.Breakfast == true
                                    ? "Yes"
                                    : "No"}
                            </div>
                            <div>
                                Group :{" "}
                                {arg.event._def.extendedProps.GroupID &&
                                arg.event._def.extendedProps.GroupID != ""
                                    ? "Yes"
                                    : "No"}
                            </div>
                        </div>
                    )
                }
            >
                <div
                    className="event-custom"
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
                                ? "5px"
                                : "0px",
                        background: "none",
                        padding: "4px 4px 0px 4px",
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
                                ? "black"
                                : arg.event._def.extendedProps.statusColor,
                        color: arg.event._def.extendedProps.statusColor
                            ? arg.event._def.extendedProps.statusColor !=
                              "rgba(255, 220, 40, 0.15)"
                                ? getContrastYIQ(
                                      arg.event._def.extendedProps.statusColor
                                  )
                                : "#3699ff"
                            : "white",

                        border:
                            arg.event._def.extendedProps.statusColor ==
                            "rgba(255, 220, 40, 0.15)"
                                ? `1px solid rgba(255, 220, 40, 0.15)`
                                : "null",
                    }}
                >
                    {arg.event._def.extendedProps.statusColor !=
                    "rgba(255, 220, 40, 0.15)" ? (
                        <Iconify
                            icon="lsicon:drag-filled"
                            width="12px"
                            style={{ marginRight: "5px", marginTop: "2px" }}
                        />
                    ) : (
                        ""
                    )}

                    {arg.event._def.extendedProps.GroupID &&
                    arg.event._def.extendedProps.GroupID != "" ? (
                        <span
                            style={{
                                marginRight: "5px",
                                marginTop: "2px",
                                color:
                                    arg.event._def.extendedProps.groupColor &&
                                    arg.event._def.extendedProps.groupColor !=
                                        ""
                                        ? arg.event._def.extendedProps
                                              .groupColor
                                        : "black",
                            }}
                        >
                            {" "}
                            <Iconify icon="clarity:group-line" width="12px" />
                        </span>
                    ) : (
                        <></>
                    )}

                    {arg.event._def.extendedProps.Balance &&
                    Number(arg.event._def.extendedProps.Balance) > 0 ? (
                        <span style={{ marginRight: "5px", marginTop: "2px" }}>
                            {" "}
                            <Iconify icon="vaadin:cash" width="12px" />
                        </span>
                    ) : (
                        <></>
                    )}

                    {arg.event._def.extendedProps.Breakfast &&
                    arg.event._def.extendedProps.Breakfast == true ? (
                        <span style={{ marginRight: "5px", marginTop: "2px" }}>
                            {" "}
                            <Iconify
                                icon="fluent:food-16-regular"
                                width="12px"
                            />
                        </span>
                    ) : (
                        <></>
                    )}
                    {arg.event.title}

                    {arg.event._def.extendedProps.statusColor !=
                    "rgba(255, 220, 40, 0.15)" ? (
                        <Iconify
                            icon="lsicon:drag-filled"
                            width="12px"
                            style={{ marginLeft: "5px", marginTop: "2px" }}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </Tooltip>
        );
    };

    const handleDayRender = (arg: any) => {
        // Check if the current day is a weekend (Saturday or Sunday)
        if (arg.date.getDay() === 0 || arg.date.getDay() === 6) {
            arg.el.style.backgroundColor = "lightgray"; // Change background color for weekends
        }
    };

    // useEffect(() => {
    //     const currentDate = new Date();
    //     const dateString = currentDate.toISOString().split("T")[0];

    //     const slots = document.querySelectorAll(".fc-timeline-slot");
    //     console.log("nabiktest", dateString);
    //     slots.forEach((slot: Element) => {
    //         console.log(
    //             "testesttest",
    //             moment((slot as HTMLElement).dataset.date).format("YYYY-MM-DD")
    //         );

    //         if (
    //             moment((slot as HTMLElement).dataset.date).format(
    //                 "YYYY-MM-DD"
    //             ) == dateString
    //         ) {
    //             // Cast slot to HTMLElement to access dataset
    //             (slot as HTMLElement).style.backgroundColor = "lightblue"; // Cast slot to HTMLElement to access style
    //             // Add any other custom styles here
    //         }
    //     });
    // }, [itemData, rerenderKey]);

    return (
        timeStart && (
            <>
                <Box sx={{ display: "flex" }}>
                    <Button
                        variant="contained"
                        className="mr-3"
                        onClick={() => {
                            // activeSessionID &&
                            //     activeSessionID == "-1" &&
                            //     handleCashierOpen();
                            dispatch({
                                type: "editId",
                                editId: null,
                            });
                            handleModal(
                                true,
                                `Захиалга нэмэх`,
                                <NewReservation workingDate={workingDate} />,
                                null,
                                "medium"
                            );
                        }}
                        startIcon={<Icon icon={plusFill} />}
                    >
                        {intl.formatMessage({
                            id: "FrontNewReservation",
                        })}
                    </Button>

                    {/* {timeStart && dayCount && (
                        <AvailableRoomTypes
                            ArrivalDate={format(timeStart, "yyyy/MM/dd ")}
                            DepartureDate={format(
                                moment(timeStart)
                                    .add(dayCount, "days")
                                    .toDate(),
                                "yyyy/MM/dd "
                            )}
                        />
                    )} */}

                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={dayCount}
                            onChange={handleChange}
                            defaultValue={15}
                        >
                            <FormControlLabel
                                value={7}
                                control={<Radio />}
                                label="7 хоног"
                            />
                            <FormControlLabel
                                value={15}
                                control={<Radio />}
                                label="15 хоног"
                            />
                            <FormControlLabel
                                value={30}
                                control={<Radio />}
                                label="30 хоног"
                            />
                        </RadioGroup>
                    </FormControl>
                    <CustomSearch
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
                    </CustomSearch>
                </Box>
                <Typography variant="subtitle2" className="mt-2">
                    {format(timeStart, "yyyy/MM/dd ") + " - "}
                    {format(
                        moment(timeStart).add(dayCount, "days").toDate(),
                        "yyyy/MM/dd "
                    )}
                </Typography>
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
                                    center: "",
                                    right: "",
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
                                dayCellContent={handleDayRender}
                                nowIndicator={true}
                                height={height}
                                // slotLaneContent={slotLaneContent}
                                eventContent={eventContent}
                                visibleRange={{
                                    start: timeStart,
                                    end: moment(timeStart)
                                        .add(dayCount, "days")
                                        .format("YYYY-MM-DD"),
                                }}
                                slotDuration="24:00:00"
                                slotLabelInterval={{ hours: 24 }}
                                resourceAreaWidth={150}
                                slotMinWidth={15}
                                // Pass the custom class names
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

                                            return arg.level == 1 ? (
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                        fontWeight: "normal",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {availableRooms &&
                                                        availableRooms[0] &&
                                                        availableRooms[0][
                                                            `D` +
                                                                (Difference_In_Days +
                                                                    1)
                                                        ] &&
                                                        availableRooms[0][
                                                            `D` +
                                                                (Difference_In_Days +
                                                                    1)
                                                        ].split("/")[0]}
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontWeight:
                                                                "normal",
                                                            textAlign: "left",
                                                            marginBottom: "5px",
                                                        }}
                                                    >
                                                        {
                                                            arg.date
                                                                .toString()
                                                                .split(" ")[0]
                                                        }
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontWeight: "bold",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        {arg.date.getDate()}
                                                    </div>
                                                </div>
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
                <Dialog
                    open={cashierOpen}
                    onClose={handleCashierClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {/*<DialogTitle id="alert-dialog-title" className=""></DialogTitle>*/}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Stack direction="column" gap={1}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <InfoIcon />
                                    <Typography variant="h6">
                                        Ээлж эхлүүлнэ үү!
                                    </Typography>
                                </Stack>
                            </Stack>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCashierClose} autoFocus>
                            ОК
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    );
};

export default MyCalendar;
