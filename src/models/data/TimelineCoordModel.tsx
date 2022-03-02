import {dateToCustomFormat, fToCustom} from "lib/utils/format-time";

interface TimelineCoordModel {
    RoomTypeID: number;
    RoomID: number;
    TimelineGroupId: string;
    TimeStart: Date;
    TimeEnd: Date;
}

const createTimelineCoord = (timelineGroupId: any, time: any) => {
    var timeStart = new Date(time);
    var ids = timelineGroupId.split("_");
    var timeEnd = new Date(timeStart.getTime());
    timeEnd.setDate(timeEnd.getDate() + 1);

    timeStart = new Date(dateToCustomFormat(timeStart, "yyyy-MM-dd 14:00:00"));
    timeEnd = new Date(dateToCustomFormat(timeEnd, "yyyy-MM-dd 12:00:00"));

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
