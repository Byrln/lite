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
