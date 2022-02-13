interface TimelineCoordModel {
    RoomTypeID: number;
    RoomID: number;
    TimelineGroupId: string;
    TimeStart: Date;
    TimeEnd: Date;
}

const createTimelineCoord = (timelineGroupId: any, timeStart: Date) => {
    var ids = timelineGroupId.split("_");
    var result: TimelineCoordModel = {
        RoomTypeID: parseInt(ids[0]),
        RoomID: typeof ids[1] !== "undefined" ? parseInt(ids[1]) : 0,
        TimelineGroupId: timelineGroupId,
        TimeStart: timeStart,
        TimeEnd: timeStart,
    };
    return result;
};

export type { TimelineCoordModel };
export { createTimelineCoord };
