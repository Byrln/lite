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

    // Convert both dates to UTC to account for daylight saving time changes
    var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    // Calculate the difference in milliseconds
    var differenceMs = Math.abs(utc2 - utc1);

    // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
    var differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    // Do not subtract 1 to include both start and end dates in the count of nights
    var numberOfNights = differenceDays;

    return numberOfNights;
}
