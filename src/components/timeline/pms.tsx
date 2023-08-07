import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader,
} from "react-calendar-timeline/lib";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { RoomSWR } from "lib/api/room";
import { RoomTypeSWR } from "lib/api/room-type";
import {
    FrontOfficeSWR,
    FrontOfficeAPI,
    listUrl as reservationListUrl,
} from "lib/api/front-office";
import { RoomBlockSWR, listUrl as roomBlockListUrl } from "lib/api/room-block";
import { ModalContext } from "lib/context/modal";
import { useState, useEffect, useContext } from "react";
import { mutate } from "swr";
import { ClickNav } from "components/timeline/_click-nav";
import ReservationDetail from "components/reservation/item-detail";
import RoomBlockDetail from "components/room/block/item-detail";
import {
    TimelineCoordModel,
    createTimelineCoord,
} from "models/data/TimelineCoordModel";
import { Box, IconButton } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import { dateToCustomFormat } from "../../lib/utils/format-time";

const filterGroups = (props: any) => {
    for (var i = 0; i < 3; i++) {
        props.groups.map((group: any) => {
            if (group.parent != null) {
                if (!props.openGroups[group.parent]) {
                    Object.assign(props.openGroups, { [group.id]: false });
                }
            }
            return group;
        });
    }
    const newGroups: any = props.groups.filter(
        (g: any) => g.parent == null || props.openGroups[g.parent]
    );
    return newGroups;
};

/*
 * TimelinePMS component
 */
const TimelinePms = ({ props, workingDate }: any) => {
    let timeStart = new Date(workingDate);
    let timeEnd = new Date(workingDate);
    timeEnd.setDate(timeEnd.getDate() + 30);

    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR();
    const { data: rooms, error: roomSwrError } = RoomSWR();
    const { data: items, error: itemsError } = FrontOfficeSWR(workingDate);
    // const {data: roomBlocks, error: roomBlocksError} = RoomBlockSWR(
    //     dateToCustomFormat(timeStart, "yyyy MMM dd"),
    //     dateToCustomFormat(timeEnd, "yyyy MMM dd")
    // );
    const { handleModal }: any = useContext(ModalContext);

    const [timelineData, setTimelineData] = useState({
        openGroups: {} as any,
        groups: [] as any,
        groupsRender: [] as any,
        items: [] as any,
    });

    useEffect(() => {
        createGroups();
    }, [roomTypes, rooms, items, roomBlocks]);

    const createGroups = () => {
        let gs = [];
        let itemData: any = [];
        var i, j;
        for (i in roomTypes) {
            gs.push({
                id: "" + roomTypes[i].RoomTypeID,
                title: roomTypes[i].RoomTypeName,
                parent: null,
                hasChild: true,
                isSaleItem: false,
                nestLevel: 0,
            });
            for (j in rooms) {
                if (rooms[j].RoomTypeID == roomTypes[i].RoomTypeID) {
                    gs.push({
                        id:
                            "" +
                            roomTypes[i].RoomTypeID +
                            "_" +
                            rooms[j].RoomID,
                        title: rooms[j].RoomNo,
                        parent: roomTypes[i].RoomTypeID,
                        hasChild: false,
                        isSaleItem: false,
                        nestLevel: 1,
                    });
                }
            }
        }

        var itemIds: Array<String> = [];
        var itemId;
        var groupKey;
        var startTime;
        var endTime;

        for (i in items) {
            itemId = items[i].TransactionID;
            if (itemIds.includes(itemId)) {
                continue;
            }

            startTime = new Date(items[i].StartDate); // startTime.setHours(14); startTime.setMinutes(0); startTime.setSeconds(0);
            endTime = new Date(items[i].EndDate);
            endTime.setDate(endTime.getDate() + 1); // endTime.setHours(12); endTime.setMinutes(0); endTime.setSeconds(0);

            groupKey = "" + items[i].RoomTypeID;
            if (items[i].RoomID != 0) {
                groupKey = groupKey + "_" + items[i].RoomID;
            }

            itemData.push({
                id: itemId,
                group: groupKey,
                start_time: startTime,
                end_time: endTime,
                itemType: "reservation",
                detail: items[i],
            });
            itemIds.push(itemId);
        }

        for (i in roomBlocks) {
            itemId = "block_" + roomBlocks[i].RoomBlockID;
            startTime = new Date(roomBlocks[i].BeginDate); // startTime.setHours(14); startTime.setMinutes(0); startTime.setSeconds(0);
            endTime = new Date(roomBlocks[i].EndDate); // endTime.setDate(endTime.getDate() + 1);
            groupKey =
                "" + roomBlocks[i].RoomTypeID + "_" + roomBlocks[i].RoomID;

            itemData.push({
                id: itemId,
                group: groupKey,
                start_time: startTime,
                end_time: endTime,
                itemType: "room_block",
                detail: roomBlocks[i],
            });
        }

        var openGroups =
            typeof timelineData.openGroups != "undefined"
                ? timelineData.openGroups
                : {};

        let renderGroups = filterGroups({
            groups: gs,
            openGroups: openGroups,
        });
        setTimelineData({
            ...timelineData,
            groups: gs,
            groupsRender: renderGroups,
            items: itemData,
        });
    };

    const toggleGroup = (groupToggling: any) => {
        const groups = timelineData.groups;
        const openGroups = timelineData.openGroups;

        let newOpenGroups = Object.assign({}, openGroups, {
            [groupToggling.id]: !openGroups[groupToggling.id],
        });
        let newGroups = filterGroups({
            groups: groups,
            openGroups: newOpenGroups,
        });

        setTimelineData({
            ...timelineData,
            openGroups: newOpenGroups,
            groupsRender: newGroups,
        });
    };

    const renderGroup = ({ group }: any) => {
        return (
            <div className={"custom_group nest_level_" + group.nestLevel}>
                {toggleIcon(group)}
                <span className="title">{group.title}</span>
                <p className="tip">{group.tip}</p>
            </div>
        );
    };

    const toggleIcon = (group: any) => {
        const { openGroups }: any = timelineData;

        return group.hasChild ? (
            <KeyboardArrowRightOutlinedIcon
                className={
                    openGroups[group.id] ? "toggle_icon open" : "toggle_icon"
                }
                onClick={() => {
                    toggleGroup(group);
                }}
            />
        ) : null;
    };

    const onCanvasEvent = (groupId: any, time: any, e: any) => {
        var timelineCoord = createTimelineCoord(groupId, time);
        handleModal(
            true,
            "Timeline menu",
            <ClickNav timelineCoord={timelineCoord} workingDate={workingDate} />
        );
    };

    const renderItem = ({
        item,
        itemContext,
        getItemProps,
        getResizeProps,
    }: any) => {
        const { left: leftResizeProps, right: rightResizeProps } =
            getResizeProps();

        return (
            <div {...getItemProps(item.itemProps)}>
                {itemContext.useResizeHandle ? (
                    <div {...leftResizeProps} />
                ) : (
                    ""
                )}

                <div
                    className="rct_item_content"
                    style={{
                        backgroundColor:
                            item.itemType === "room_block"
                                ? "#505050"
                                : `#${item.detail.StatusColor}`,
                    }}
                    onDoubleClick={(evt: any) => {
                        if (item.itemType === "reservation") {
                            handleModal(
                                true,
                                "Reservation Detail",
                                <ReservationDetail itemInfo={item} />,
                                true,
                                "large"
                            );
                        } else if (item.itemType === "room_block") {
                            handleModal(
                                true,
                                "Room block",
                                <RoomBlockDetail
                                    itemInfo={item}
                                    getRoomBlockDetail={getRoomBlockDetail}
                                />
                            );
                        }
                    }}
                    title={item.description}
                >
                    {item.detail.GroupID > 0 && (
                        <div className={"item_icon"}>
                            <AutoAwesomeMosaicIcon
                                style={{ fill: item.detail.GroupColor }}
                            />
                        </div>
                    )}
                    <div>
                        {item.itemType === "room_block"
                            ? `${item.detail.UserName}`
                            : `${item.detail.GuestID} ${item.detail.GuestName}`}
                    </div>
                </div>

                {itemContext.useResizeHandle ? (
                    <div {...rightResizeProps} />
                ) : (
                    ""
                )}
            </div>
        );
    };

    const reloadTimeline = async () => {
        await mutate(reservationListUrl);
        await mutate(roomBlockListUrl);
    };

    const getRoomBlockDetail = (id: number) => {
        let result = null;
        let rb;
        for (rb of roomBlocks) {
            if (rb.RoomBlockID === id) {
                result = rb;
                break;
            }
        }
        return result;
    };

    return (
        <>
            <Box>
                <IconButton
                    color={"secondary"}
                    onClick={(evt: any) => {
                        reloadTimeline();
                    }}
                >
                    <ReplayIcon />
                </IconButton>
            </Box>

            <div className={"timeline_main"}>
                <Timeline
                    groups={timelineData.groupsRender}
                    items={timelineData.items}
                    visibleTimeStart={timeStart}
                    visibleTimeEnd={timeEnd}
                    // defaultTimeStart={timeStart}
                    // defaultTimeEnd={timeEnd}
                    // defaultTimeStart={moment().add(-12, "hour")}
                    // defaultTimeEnd={moment().add(12, "hour")}
                    groupRenderer={renderGroup}
                    itemRenderer={renderItem}
                    lineHeight={50}
                    itemHeightRatio={0.8}
                    sidebarWidth={300}
                    minZoom={10 * 24 * 60 * 60 * 1000}
                    maxZoom={10 * 24 * 60 * 60 * 1000}
                    onCanvasContextMenu={onCanvasEvent}
                    onCanvasDoubleClick={onCanvasEvent}
                >
                    <TimelineHeaders
                        className={"timeline_header"}
                        calendarHeaderClassName={"calendar_header"}
                    >
                        <SidebarHeader>
                            {({ getRootProps }: any) => {
                                return (
                                    <div
                                        {...getRootProps()}
                                        className={"sidebar_header"}
                                    ></div>
                                );
                            }}
                        </SidebarHeader>
                        <DateHeader
                            unit="primaryHeader"
                            className={"date_header"}
                        />
                        <DateHeader />
                    </TimelineHeaders>
                </Timeline>
            </div>
        </>
    );
};

export default TimelinePms;
