import { format, formatDistanceToNow } from "date-fns";

export function fDate(date: any) {
    return format(new Date(date), "dd MMMM yyyy");
}

export function fDateTime(date: any) {
    return format(new Date(date), "dd MMM yyyy HH:mm");
}

export function fDateTimeSuffix(date: any) {
    return format(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function fToNow(date: any) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
    });
}

export function fToUniversal(date: any) {
    return format(new Date(date), "yyyy MMM dd");
}

export function fToCustom(date: any, formatStr: string) {
    return format(new Date(date), formatStr);
}

export function dateToSimpleFormat(date: Date) {
    return format(date, "yyyy-MM-dd");
}

export function dateToCustomFormat(date: Date, formatStr: string) {
    return format(date, formatStr);
}

export function countNights(d1: any, d2: any) {
    var date1 = new Date(d1);
    var date2 = new Date(d2);

    var timeDiff = date2.getTime() - date1.getTime();
    const endAtMidnight =
        date2.getHours() === 0 &&
        date2.getMinutes() === 0 &&
        date2.getSeconds() === 0 &&
        date2.getMilliseconds() === 0;

    var numberOfNights = Math.floor(timeDiff / (1000 * 3600 * 24));

    // if (!endAtMidnight) {
    //     numberOfNights--;
    // }

    return numberOfNights;
}
