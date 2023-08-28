import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader,
} from "react-calendar-timeline/lib";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import moment from "moment";
import { RoomAPI } from "../../lib/api/room";
import { RoomTypeAPI } from "../../lib/api/room-type";
import { FrontOfficeSWR, FrontOfficeAPI } from "../../lib/api/front-office";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import { useState, useEffect } from "react";
import useSWR from "swr";

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
    // const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR();
    // const { data: rooms, error: roomSwrError } = RoomSWR();
    // const { data: items, error: itemsError } = FrontOfficeSWR(workingDate);

    let timeStart = new Date(workingDate);
    let timeEnd = new Date(
        timeStart.getFullYear(),
        timeStart.getMonth() + 1,
        timeStart.getDate()
    );

    const [timelineData, setTimelineData] = useState({
        openGroups: {} as any,
        groups: [] as any,
        groupsRender: [] as any,
        items: [] as any,
    });
    useEffect(() => {
        // createGroups();
    }, []);
    const createGroups = async () => {
        let response: ApiResponseModel = await RoomTypeAPI.list(null);
        let roomTypes: any = [];
        if (response.status == 200) {
            roomTypes = response.data;
        }
        response = await RoomAPI.list(null);
        let rooms: any = [];
        if (response.status == 200) {
            rooms = response.data;
        }

        let gs = [];
        let itemData = [];
        var i, j;
        for (i in roomTypes) {
            gs.push({
                id: roomTypes[i].RoomTypeID,
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

        let renderGroups = filterGroups({
            groups: gs,
            openGroups: {},
        });
        setTimelineData({
            ...timelineData,
            groups: gs,
            groupsRender: renderGroups,
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
                    className="rct-item-content"
                    style={{ maxHeight: `${itemContext.dimensions.height}` }}
                    onClick={() => {}}
                    title={item.description}
                >
                    <div>{item.title}</div>
                    <div>{item.description}</div>
                </div>

                {itemContext.useResizeHandle ? (
                    <div {...rightResizeProps} />
                ) : (
                    ""
                )}
            </div>
        );
    };

    return (
        <>
            <h4>Хянах самбар тест</h4>
            <div className="timeline_main">
                <Timeline
                    groups={timelineData.groupsRender}
                    items={timelineData.items}
                    defaultTimeStart={moment().add(-12, "hour")}
                    defaultTimeEnd={moment().add(12, "hour")}
                    // defaultTimeStart={timeStart}
                    // defaultTimeEnd={timeEnd}
                    groupRenderer={renderGroup}
                    itemRenderer={renderItem}
                    itemHeightRatio={0.8}
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
