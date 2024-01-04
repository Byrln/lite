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
    Grid,
} from "@mui/material";
import { format } from "date-fns";

import { RoomTypeSWR } from "../../lib/api/room-type";
import { RoomSWR } from "lib/api/room";
import { StayView2SWR } from "lib/api/stay-view2";
import { FrontOfficeAPI, FrontOfficeSWR, listUrl } from "lib/api/front-office";
import NewReservation from "components/front-office/reservation-list/new";
import { ModalContext } from "lib/context/modal";
import { RoomBlockSWR } from "lib/api/room-block";
import { dateToCustomFormat } from "lib/utils/format-time";
import { useAppState } from "lib/context/app";
import Search from "./search";
import CustomSearch from "components/common/custom-search";
import { dateStringToObj } from "lib/utils/helpers";
import ReservationEdit from "components/front-office/reservation-list/edit";

const MyCalendar: React.FC = ({ workingDate }: any) => {
    const [state, dispatch]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);
    const [dayCount, setDayCount] = useState(15);

    const [search, setSearch] = useState({
        CurrDate: workingDate,
        NumberOfDays: dayCount,
        RoomTypeID: 0,
    });

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
        CurrDate: search.CurrDate ? search.CurrDate : workingDate,
        NumberOfDays: dayCount,
        RoomTypeID: search.RoomTypeID,
    });
    const [timeStart, setTimeStart] = useState(new Date(workingDate));
    const [timeEnd, setTimeEnd] = useState(
        new Date(
            new Date(workingDate).setDate(new Date(workingDate).getDate() + 7)
        )
    );

    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR({
        RoomTypeID: search.RoomTypeID,
    });
    const { data: rooms, error: roomSwrError } = RoomSWR({});
    const { data: roomBlocks, error: roomBlocksError } = RoomBlockSWR(
        //@ts-ignore
        dateToCustomFormat(timeStart, "yyyy MMM dd"),
        dateToCustomFormat(timeEnd, "yyyy MMM dd")
    );
    const [resources, setResources] = useState<any>(null);
    const [itemData, setItemData] = useState<any>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [height, setHeight] = useState<any>(null);
    const { data: availableRooms, error: availableRoomsError } = StayView2SWR(
        search.CurrDate ? search.CurrDate : workingDate,
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
            setTimeStart(new Date(search.CurrDate));
            setTimeEnd(
                new Date(
                    new Date(search.CurrDate).setDate(
                        new Date(search.CurrDate).getDate() + 7
                    )
                )
            );
            setRerenderKey((prevKey) => prevKey + 1);

            await mutate("/api/RoomType/List");
            await mutate("/api/FrontOffice/StayView2");
            await mutate("/api/FrontOffice/ReservationDetailsByDate");
        })();
    }, [search]);

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
                    id: `${obj.RoomTypeName}-${obj.RoomTypeID}`,
                    title: obj.RoomTypeName,
                };
            });
            const newData = rooms.map((obj: any) => {
                return {
                    parentId: `${obj.RoomTypeName}-${obj.RoomTypeID}`,
                    roomTypeId: obj.RoomTypeID,
                    id: obj.RoomID,
                    title: obj.RoomNo,
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
        // `info` contains information about the clicked event
        handleModal(
            true,
            `Захиалга`,
            <ReservationEdit
                transactionID={info.event._def.extendedProps.transactionID}
            />,
            null,
            "large"
        );
    };

    const handleEventDrop = (info: any) => {
        const newEventObject = {
            title: "New Event",
            start: info.event._instance.range.start,
            end: info.event._instance.range.end,
            roomTypeID: Number(info.event._def.extendedProps.roomTypeID),
            roomID: Number(info.event._def.resourceIds[0]),
        };

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

        if (!info.event.extendedProps.block) {
            handleModal(
                true,
                `New Reservation`,
                <NewReservation
                    dateStart={newEventObject.start}
                    dateEnd={newEventObject.end}
                    // // @ts-ignore
                    roomType={newEventObject.roomTypeID}
                    // // @ts-ignore
                    room={newEventObject.roomID}
                />,
                null,
                "large"
            );
        }
    };

    const handleEventResize = (info: any) => {
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
            start: info.event._instance.range.start,
            end: info.event._instance.range.end,
            roomTypeID: Number(info.event._def.extendedProps.roomTypeID),
            roomID: Number(info.event._def.resourceIds[0]),
        };

        handleModal(
            true,
            `New Reservation`,
            <NewReservation
                dateStart={newEventObject.start}
                dateEnd={newEventObject.end}
                // // @ts-ignore
                roomType={newEventObject.roomTypeID}
                // // @ts-ignore
                room={newEventObject.roomID}
            />,
            null,
            "large"
        );
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
                />,
                null,
                "large"
            );
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
                                <NewReservation />,
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
                    >
                        <Search
                            register={register}
                            errors={errors}
                            control={control}
                            reset={reset}
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
                        now={timeStart}
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
                <Grid container direction="row" className="mt-2">
                    <Grid
                        item
                        xs={12}
                        style={{ display: "flex", flexWrap: "wrap" }}
                    >
                        <div
                            className="mr-3 pl-1 pr-1 mb-1"
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
                            className="mr-3 pl-1 pr-1 mb-1"
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
                            className="mr-3 pl-1 pr-1 mb-1"
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
                            className="mr-3 pl-1 pr-1 mb-1"
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
                            className="mr-3 pl-1 pr-1 mb-1"
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
                            className="mr-3 pl-1 pr-1 mb-1"
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
                            className="mr-3 pl-1 pr-1 mb-1"
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
                            className="mr-3 pl-1 pr-1 mb-1"
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
                </Grid>
            </>
        )
    );
};

export default MyCalendar;
