interface TimelineCoordModel {
    RoomTypeID: number;
    RoomID: number;
    TimelineGroupId: string;
    TimeStart: Date;
    TimeEnd: Date;
}

const createTimelineCoord = (timelineGroupId: any, timeStart: Date) => {
    var ids = timelineGroupId.split("_");
    var timeEnd = new Date(timeStart.getTime());
    timeEnd.setDate(timeEnd.getDate() + 1);
    var result: TimelineCoordModel = {
        RoomTypeID: parseInt(ids[0]),
        RoomID: typeof ids[1] !== "undefined" ? parseInt(ids[1]) : 0,
        TimelineGroupId: timelineGroupId,
        TimeStart: timeStart,
        TimeEnd: timeEnd,
    };
    return result;
};

export type { TimelineCoordModel };
export { createTimelineCoord };
