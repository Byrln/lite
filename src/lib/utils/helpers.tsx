export function monthsByNumber() {
    return [
        { value: 1, name: "January" },
        { value: 2, name: "February" },
        { value: 3, name: "March" },
        { value: 4, name: "April" },
        { value: 5, name: "May" },
        { value: 6, name: "June" },
        { value: 7, name: "July" },
        { value: 8, name: "August" },
        { value: 9, name: "September" },
        { value: 10, name: "October" },
        { value: 11, name: "November" },
        { value: 12, name: "December" },
    ];
}

export function notificationType() {
    return [
        { value: 1, name: "User Roles" },
        { value: 2, name: "Users" },
    ];
}

export function monthDays() {
    return [
        { key: 1, value: 1 },
        { key: 2, value: 2 },
        { key: 3, value: 3 },
        { key: 4, value: 4 },
        { key: 5, value: 5 },
        { key: 6, value: 6 },
        { key: 7, value: 7 },
        { key: 8, value: 8 },
        { key: 9, value: 9 },
        { key: 10, value: 10 },
        { key: 11, value: 11 },
        { key: 12, value: 12 },
        { key: 13, value: 13 },
        { key: 14, value: 14 },
        { key: 15, value: 15 },
        { key: 16, value: 16 },
        { key: 17, value: 17 },
        { key: 18, value: 18 },
        { key: 19, value: 19 },
        { key: 20, value: 20 },
        { key: 21, value: 21 },
        { key: 22, value: 22 },
        { key: 23, value: 23 },
        { key: 24, value: 24 },
        { key: 25, value: 25 },
        { key: 26, value: 26 },
        { key: 27, value: 27 },
        { key: 28, value: 28 },
        { key: 29, value: 29 },
        { key: 30, value: 30 },
        { key: 31, value: 31 },
    ];
}

export function formatPrice(number: any) {
    const fnumber = parseFloat(number);
    return new Intl.NumberFormat("en-US", {
        // style: "currency",
        // currency: "USD",
    }).format(fnumber);
}

export function capitalize(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowercase(string: any) {
    return string.toLowerCase();
}

export function toCamelCase(str: any) {
    return str
        .toLowerCase()
        .replace(/[-_]+/g, " ")
        .replace(/[^\w\s]/g, "")
        .replace(/ (.)/g, function ($1: any) {
            return $1.toUpperCase();
        })
        .replace(/ /g, "");
}

export function objectToCamelCase(origObj: any) {
    return Object.keys(origObj).reduce(function (newObj: any, key: any) {
        let val = origObj[key];
        newObj[toCamelCase(key)] =
            typeof val === "object" ? objectToCamelCase(val) : val;

        return newObj;
    }, {});
}

// Function to Serialize an Object into a list of URL query parameters
export function objectToParams(obj: any) {
    return Object.keys(JSON.parse(JSON.stringify(obj)))
        .map(function (key) {
            if (obj[key]) return key + "=" + encodeURIComponent(obj[key]);
        })
        .join("&");
}

export function urlParamsToObject(url: any) {
    const query: any = new URLSearchParams(url);

    const obj: any = {};

    for (let param of query.entries()) {
        obj[param[0]] = param[1];
    }

    return obj;
}

export function checkFloat(x: any) {
    // check if the passed value is a number
    if (typeof x == "number" && !isNaN(x)) {
        // check if it is integer
        return !Number.isInteger(x);
    } else {
        return false;
    }
}

export function getCurrentDate() {
    const today = new Date();

    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
}

export function removeParams(sParam: any) {
    let url = window.location.href.split("?")[0] + "?";
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split("&"),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] != sParam) {
            url = url + sParameterName[0] + "=" + sParameterName[1] + "&";
        }
    }

    return url.substring(0, url.length - 1);
}

export function dateStringToObj(date: any) {
    // return new Date(date.replace(/ /g, "T")).setTime(
    //     new Date(date.replace(/ /g, "T")).getTime() +
    //         new Date(date.replace(/ /g, "T")).getTimezoneOffset() * 60 * 1000
    // );
    console.log(date);
    return new Date(date.replace(/ /g, "T"));
}

export function formatNumber(value: any) {
    if (!value) {
        return "";
    }
    // Convert the input to a number and format as string
    const formattedValue = parseFloat(value).toLocaleString("en-US");

    return formattedValue;
}

export function daysInMonth(month: any, year: any) {
    return new Date(year, month, 0).getDate();
}
