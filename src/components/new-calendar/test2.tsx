import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction"; // Import the interaction plugin
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { RoomTypeSWR } from "../../lib/api/room-type";
import { RoomSWR } from "lib/api/room";
import moment from "moment";
import { mutate } from "swr";
import {
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
} from "@mui/material";
import { StayView2SWR } from "lib/api/stay-view2";
import { FrontOfficeAPI, FrontOfficeSWR, listUrl } from "lib/api/front-office";
import NewReservation from "components/front-office/reservation-list/new-edit";
import { ModalContext } from "lib/context/modal";

const MyCalendar: React.FC = ({ workingDate }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    const [dayCount, setDayCount] = useState(15);
    const {
        data: items,
        mutate: mutateItems,
        error: itemsError,
    } = FrontOfficeSWR({
        CurrDate: workingDate,
        NumberOfDays: 15,
    });

    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR({});
    const { data: rooms, error: roomSwrError } = RoomSWR({});
    const [resources, setResources] = useState<any>(null);
    const [itemData, setItemData] = useState<any>(null);

    const [height, setHeight] = useState<any>(null);
    const { data: availableRooms, error: availableRoomsError } = StayView2SWR(
        workingDate,
        dayCount
    );
    console.log("availableRooms", availableRooms);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = Number((event.target as HTMLInputElement).value);
        console.log("event", (event.target as HTMLInputElement).value);
        setDayCount(Number((event.target as HTMLInputElement).value));

        mutate("/api/FrontOffice/StayView2");
        console.log("dayCount", dayCount);
    };

    useEffect(() => {
        if (items) {
            const newItemDta = items.map((obj: any) => {
                return {
                    id: obj.TransactionID,
                    title: obj.GuestName,
                    start: obj.StartDate,
                    end: obj.EndDate,
                    resourceId: obj.RoomID,
                    editable: true,
                };
            });
            setItemData(newItemDta);
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
        setHeight(window.innerHeight - 200);
    }, [window.innerHeight]);

    const [newEvent, setNewEvent] = useState<any>(null);

    const handleEventDrop = (info: any) => {
        console.log("Event dropped", info.event);
        handleModal(
            true,
            `New Reservation`,
            <NewReservation
            // dateStart={start}
            // // @ts-ignore
            // roomType={resourceId}
            // // @ts-ignore
            // room={resourceId}
            />,
            null,
            "large"
        );
    };

    const handleEventResize = (info: any) => {
        console.log("Event resized", info.event);
        console.log("info", info);
        handleModal(
            true,
            `New Reservation`,
            <NewReservation
            // dateStart={start}
            // // @ts-ignore
            // roomType={resourceId}
            // // @ts-ignore
            // room={resourceId}
            />,
            null,
            "large"
        );
    };

    const handleSelect = (info: any) => {
        const { start, end, resourceId } = info;

        const newEventObject = {
            title: "New Event",
            start: start,
            end: end,
            roomTypeID: Number(
                info.resource._resource.extendedProps.roomTypeId
            ),
            roomID: Number(info.resource._resource.id),
        };
        console.log("newEventObject", newEventObject);

        setNewEvent(newEventObject);
        console.log("newEvent", newEvent);
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
    };

    const slotLabelContent = (args: any) => {
        // Calculate index based on the start time of the view and the time duration of each slot
        const slotDuration = args.view.options.slotDuration; // Duration of each time slot
        const viewStart = args.view.currentStart; // Start time of the view
        const slotIndex = Math.floor((args.date - viewStart) / slotDuration);

        return (
            <div>
                <div>{args.date.toLocaleTimeString()}</div>
                <div>Slot Index: {slotIndex}</div>
            </div>
        );
    };

    return (
        <>
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

            {resources && dayCount && (
                <FullCalendar
                    plugins={[resourceTimelinePlugin, interactionPlugin]}
                    initialView="resourceTimeline"
                    headerToolbar={{
                        left: "",
                        center: "",
                        right: "",
                    }}
                    resources={resources}
                    initialDate={workingDate}
                    events={itemData}
                    selectable={true}
                    select={handleSelect}
                    editable={true}
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    height={height}
                    visibleRange={{
                        start: workingDate,
                        end: moment(workingDate)
                            .add(30, "days")
                            .format("YYYY-MM-DD"),
                    }}
                    slotDuration="12:00:00"
                    slotLabelInterval={{ hours: 24 }}
                    views={{
                        timeline: {
                            type: "resourceTimeline",
                            duration: { days: dayCount },
                            slotLabelContent: (arg: any) => {
                                var Difference_In_Time =
                                    arg.date.getTime() -
                                    new Date(workingDate).getTime();

                                var Difference_In_Days =
                                    Difference_In_Time / (1000 * 3600 * 24);

                                return arg.level == 1
                                    ? availableRooms &&
                                          availableRooms[0] &&
                                          availableRooms[0][
                                              `D` + (Difference_In_Days + 1)
                                          ]
                                    : arg.text;
                            },
                        },
                    }}
                />
            )}
        </>
    );
};

export default MyCalendar;
