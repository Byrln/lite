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

export function toSimpleFormat(date: Date) {
    var month: number = date.getMonth();
    month = month + 1;
    var monthStr: string = month < 10 ? "0" + month : "" + month;
    var dayStr: string =
        date.getDay() < 10 ? "0" + date.getDay() : "" + date.getDay();
    return date.getFullYear() + "-" + monthStr + "-" + dayStr;
}
