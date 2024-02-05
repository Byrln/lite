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
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Box,
    Button,
    Typography,
} from "@mui/material";
import { format } from "date-fns";

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

const MyCalendar: React.FC = ({ workingDate }: any) => {
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

    function extractNumberFromString(str: any) {
        const parts = str.split("-");
        const firstNumber = parseInt(parts[0], 10);

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
    const [timeStart, setTimeStart] = useState(new Date(workingDate));
    const [timeEnd, setTimeEnd] = useState(
        new Date(
            new Date(workingDate).setDate(new Date(workingDate).getDate() + 7)
        )
    );

    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR({
        RoomTypeID: searchRoomTypeID,
    });
    const { data: rooms, error: roomSwrError } = RoomSWR({});
    const { data: roomBlocks, error: roomBlocksError } = RoomBlockSWR({
        //@ts-ignore
        StartDate: dateToCustomFormat(timeStart, "yyyy MMM dd"),
        EndDate: dateToCustomFormat(timeEnd, "yyyy MMM dd"),
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
            if (searchCurrDate == "Invalid date") {
                setSearchCurrDate(new Date(workingDate));

                setTimeStart(new Date(workingDate));
                setTimeEnd(
                    new Date(
                        new Date(workingDate).setDate(
                            new Date(workingDate).getDate() + 7
                        )
                    )
                );
            } else {
                setTimeStart(new Date(searchCurrDate));
                setTimeEnd(
                    new Date(
                        new Date(searchCurrDate).setDate(
                            new Date(searchCurrDate).getDate() + 7
                        )
                    )
                );
            }

            setRerenderKey((prevKey) => prevKey + 1);

            await mutate("/api/RoomType/List");
            await mutate("/api/FrontOffice/StayView2");
            await mutate("/api/FrontOffice/ReservationDetailsByDate");
        })();
    }, [searchCurrDate, searchRoomTypeID, dayCount]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        (async () => {
            setDayCount(Number((event.target as HTMLInputElement).value));

            await mutate("/api/RoomType/List");
            await mutate("/api/FrontOffice/StayView2");
            await mutate("/api/FrontOffice/ReservationDetailsByDate");
        })();
    };

    useEffect(() => {
        if (items) {
            let itemDataConcated = null;
            const newItemDta = items.map((obj: any) => {
                return {
                    id: obj.TransactionID,
                    title: obj.GuestName,
                    start: obj.StartDate,
                    end: obj.EndDate,
                    resourceId: obj.RoomID
                        ? obj.RoomID
                        : `${obj.RoomTypeName}-${obj.RoomTypeID}`,
                    roomTypeID: obj.RoomTypeID,
                    transactionID: obj.TransactionID,
                    editable: true,
                    color: `#${obj.StatusColor}`,
                };
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

                itemDataConcated = newItemDta.concat(newRoomBlockDta);
            }

            setItemData(itemDataConcated ? itemDataConcated : newItemDta);
        }
    }, [items]);

    useEffect(() => {
        if (rooms && roomTypes) {
            const newRoomTypeData = roomTypes.map((obj: any) => {
                return {
                    id: `${obj.RoomTypeID}-${obj.RoomTypeID}`,
                    title: obj.RoomTypeName,
                };
            });
            const newData = rooms.map((obj: any) => {
                return {
                    parentId: `${obj.RoomTypeID}-${obj.RoomTypeID}`,
                    roomTypeId: obj.RoomTypeID,
                    id: obj.RoomID,
                    title: obj.RoomNo,
                    MaxAdult: obj.MaxAdult,
                    MaxChild: obj.MaxChild,
                    BaseAdult: obj.BaseAdult,
                    BaseChild: obj.BaseChild,
                };
            });

            setResources(newRoomTypeData.concat(newData));
        }
    }, [roomTypes, rooms]);

    useEffect(() => {
        setHeight(window.innerHeight - 225);
    }, [window.innerHeight]);

    const [newEvent, setNewEvent] = useState<any>(null);

    const handleEventClick = (info: any) => {
        if (info.event._instance.range.end > new Date(workingDate)) {
            handleModal(
                true,
                `Захиалга`,
                <ReservationEdit
                    transactionID={info.event._def.extendedProps.transactionID}
                />,
                null,
                "large"
            );
        }
    };

    const handleEventDrop = (info: any) => {
        if (info.event._instance.range.end > new Date(workingDate)) {
            const newEventObject = {
                title: "New Event",
                ArrivalDate: info.event._instance.range.start,
                DepartureDate: info.event._instance.range.end,
                RoomTypeID: extractNumberFromString(
                    info.newResource._resource.parentId
                ),
                RoomID: Number(info.event._def.resourceIds[0]),
                TransactionID: Number(
                    info.event._def.extendedProps.transactionID
                ),
            };

            if (!info.event.extendedProps.block) {
                handleModal(
                    true,
                    `New Reservation`,
                    <RoomMoveForm
                        transactionInfo={newEventObject}
                        additionalMutateUrl="/api/Reservation/List"
                    />,
                    null,
                    "large"
                );
            }
        }
        setRerenderKey((prevKey) => prevKey + 1);
    };

    const handleEventResize = (info: any) => {
        if (info.event._instance.range.end > new Date(workingDate)) {
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

            handleModal(
                true,
                "Amend Stay",
                <AmendStayForm
                    transactionInfo={newEventObject}
                    reservation={newEventObject}
                    additionalMutateUrl="/api/Reservation/List"
                />
            );
        }
    };

    const handleSelect = (info: any) => {
        const { start, end, resourceId } = info;
        if (start > new Date(workingDate)) {
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
                BaseAdult: Number(
                    info.resource._resource.extendedProps.BaseAdult
                ),
                BaseChild: Number(
                    info.resource._resource.extendedProps.BaseChild
                ),
                MaxAdult: Number(
                    info.resource._resource.extendedProps.MaxAdult
                ),
                MaxChild: Number(
                    info.resource._resource.extendedProps.MaxChild
                ),
            };

            setNewEvent(newEventObject);

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
                    "large"
                );
            }
        }
    };

    return (
        timeStart && (
            <>
                <Box sx={{ display: "flex" }}>
                    <Button
                        variant="contained"
                        className="mr-3"
                        onClick={() => {
                            handleModal(
                                true,
                                `Захиалга нэмэх`,
                                <NewReservation workingDate={workingDate} />,
                                null,
                                "large"
                            );
                        }}
                        startIcon={<Icon icon={plusFill} />}
                    >
                        Нэмэх
                    </Button>

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
                {resources && dayCount && timeStart && (
                    <FullCalendar
                        key={rerenderKey}
                        plugins={[resourceTimelinePlugin, interactionPlugin]}
                        initialView="resourceTimeline"
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
                        nowIndicator={true}
                        height={height}
                        visibleRange={{
                            start: timeStart,
                            end: moment(timeStart)
                                .add(dayCount, "days")
                                .format("YYYY-MM-DD"),
                        }}
                        slotDuration="12:00:00"
                        slotLabelInterval={{ hours: 24 }}
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
                                return false;
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
                                        Difference_In_Time / (1000 * 3600 * 24)
                                    );

                                    return arg.level == 1 ? (
                                        availableRooms &&
                                            availableRooms[0] &&
                                            availableRooms[0][
                                                `D` + (Difference_In_Days + 1)
                                            ]
                                    ) : (
                                        <div>
                                            <div>
                                                {
                                                    arg.date
                                                        .toString()
                                                        .split(" ")[0]
                                                }
                                            </div>
                                            <div>{arg.date.getDate()}</div>
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
                {/* <Grid container direction="row" className="mt-2">
                    <Grid
                        item
                        xs={12}
                        style={{ display: "flex", flexWrap: "wrap" }}
                    >
                        <div
                            className="pl-1 pr-1 mb-1 mr-3"
                            style={{
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: "#330011",
                                    borderRadius: "4px",
                                }}
                                className="mr-1"
                            ></div>
                            Ирсэн
                        </div>
                        <div
                            className="pl-1 pr-1 mb-1 mr-3"
                            style={{
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: "#991100",
                                    borderRadius: "4px",
                                }}
                                className="mr-1"
                            ></div>
                            Гарсан
                        </div>
                        <div
                            className="pl-1 pr-1 mb-1 mr-3"
                            style={{
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: "#6699FF",
                                    borderRadius: "4px",
                                }}
                                className="mr-1"
                            ></div>
                            Гарах
                        </div>
                        <div
                            className="pl-1 pr-1 mb-1 mr-3"
                            style={{
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: "#009933",
                                    borderRadius: "4px",
                                }}
                                className="mr-1"
                            ></div>
                            Баталгаажсан
                        </div>
                        <div
                            className="pl-1 pr-1 mb-1 mr-3"
                            style={{
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: "#000000",
                                    borderRadius: "4px",
                                }}
                                className="mr-1"
                            ></div>
                            Блок
                        </div>
                        <div
                            className="pl-1 pr-1 mb-1 mr-3"
                            style={{
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: "#CCFF00",
                                    borderRadius: "4px",
                                }}
                                className="mr-1"
                            ></div>
                            Дахин хонох
                        </div>
                        <div
                            className="pl-1 pr-1 mb-1 mr-3"
                            style={{
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: "#009933",
                                    borderRadius: "4px",
                                }}
                                className="mr-1"
                            ></div>
                            Өдрөөр захиалга
                        </div>
                        <div
                            className="pl-1 pr-1 mb-1 mr-3"
                            style={{
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: "#FF66FF",
                                    borderRadius: "4px",
                                }}
                                className="mr-1"
                            ></div>
                            Өдрөөр ашиглах
                        </div>
                    </Grid>
                </Grid> */}
            </>
        )
    );
};

export default MyCalendar;
