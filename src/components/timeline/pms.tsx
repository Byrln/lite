import Timeline from "react-calendar-timeline";
import {
    TimelineHeaders,
    SidebarHeader,
    DateHeader,
} from "react-calendar-timeline";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import moment from "moment";
import { RoomSWR } from "lib/api/room";
import { RoomTypeSWR } from "lib/api/room-type";
import { FrontOfficeSWR, FrontOfficeAPI } from "lib/api/front-office";
import { ModalContext } from "lib/context/modal";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import { ClickNav } from "components/timeline/_click-nav";
import ItemDetail from "components/reservation/item-detail";
import {
    TimelineCoordModel,
    createTimelineCoord,
} from "models/data/TimelineCoordModel";

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
    const newGroups = props.groups.filter(
        (g: any) => g.parent == null || props.openGroups[g.parent]
    );
    return newGroups;
};

/*
 * TimelinePMS component
 */
const TimelinePms = ({ props, workingDate }: any) => {
    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR();
    const { data: rooms, error: roomSwrError } = RoomSWR();
    const { data: items, error: itemsError } = FrontOfficeSWR(workingDate);
    const { handleModal }: any = useContext(ModalContext);

    let timeStart = new Date(workingDate);
    let timeEnd = new Date(workingDate);
    timeEnd.setDate(timeEnd.getDate() + 30);

    const [timelineData, setTimelineData] = useState({
        openGroups: {} as any,
        groups: [] as any,
        groupsRender: [] as any,
        items: [] as any,
    });
    useEffect(() => {
        createGroups();
    }, [roomTypes, rooms, items]);
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
                    // console.log(rooms[j]);
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

        for (i in items) {
            itemId = items[i].TransactionID + "_" + items[i].RoomID;
            if (itemIds.includes(itemId)) {
                continue;
            }
            itemData.push({
                id: itemId,
                group: "" + items[i].RoomTypeID + "_" + items[i].RoomID,
                title: items[i].GuestName,
                description: items[i].GuestName,
                transactionId: items[i].TransactionID,
                start_time: new Date(items[i].StartDate),
                end_time: new Date(items[i].EndDate),
                colorCode: items[i].GroupColor,
            });
            itemIds.push(itemId);
        }
        let renderGroups = filterGroups({
            groups: gs,
            openGroups: {},
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

    const onCanvasContextMenu = (groupId: any, time: any, e: any) => {
        console.log("Group ID: ", groupId);
        console.log("========= Time: ========= ", time);
        var timeObj = new Date(time);

        var timelineCoord = createTimelineCoord(groupId, timeObj);

        handleModal(
            true,
            "Timeline menu",
            <ClickNav timelineCoord={timelineCoord} />
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
                {/* {...getItemProps(item.itemProps)} */}

                {itemContext.useResizeHandle ? (
                    <div {...leftResizeProps} />
                ) : (
                    ""
                )}

                <div
                    className="rct-item-content"
                    style={{
                        maxHeight: `${itemContext.dimensions.height}`,
                        width: `100%`,
                        backgroundColor: `#${item.colorCode}`,
                    }}
                    // onClick={(evt: any) => {
                    //     console.log(evt);
                    // }}
                    onDoubleClick={(evt: any) => {
                        handleModal(
                            true,
                            "Timeline menu",
                            <ItemDetail itemInfo={item} />
                        );
                    }}
                    title={item.description}
                >
                    <div>{item.title}</div>
                </div>

                {itemContext.useResizeHandle ? (
                    <div {...rightResizeProps} />
                ) : (
                    ""
                )}
            </div>
        );
    };

    useEffect(() => {}, []);

    return (
        <>
            <div className="timeline_main">
                <Timeline
                    groups={timelineData.groupsRender}
                    items={timelineData.items}
                    visibleTimeStart={timeStart}
                    visibleTimeEnd={timeEnd}
                    // defaultTimeStart={moment().add(-12, "hour")}
                    // defaultTimeEnd={moment().add(12, "hour")}
                    groupRenderer={renderGroup}
                    itemRenderer={renderItem}
                    itemHeightRatio={0.8}
                    sidebarWidth={300}
                    minZoom={10 * 24 * 60 * 60 * 1000}
                    maxZoom={10 * 24 * 60 * 60 * 1000}
                    onCanvasContextMenu={onCanvasContextMenu}
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
