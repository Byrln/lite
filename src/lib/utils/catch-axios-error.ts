import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

import moment from "moment";
import { dateStringToObj } from "lib/utils/helpers";

const catchAxiosError = (error: any) => {
    let message;
    const response = error.response;

    if (response) {
    
        message = response.data.detail
            ? response.data.detail
            : response.data.message
            ? response.data.message
            : response.data.Message;

        if (
            typeof window !== "undefined" &&
            response.status === 401 &&
            response.config &&
            !response.__isRetryRequest
        ) {
            if (localStorage.getItem("expires")) {
                if (
                    dateStringToObj(localStorage.getItem("expires")) <
                    new Date()
                ) {
                    signOut({ callbackUrl: "/auth/login" });
                } else {
                    toast("Хандах эрх байхгүй байна");
                }
            } else {
                signOut({ callbackUrl: "/auth/login" });
            }
        }
    } else if (error.request) {
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("Request", error.request);
        message = error.request;
    } else {
        // Something happened in setting up the request and triggered an Error
        console.log("Error", error.message);
        message = error.message;
    }

    console.log("Axios config", error.config);
    console.log("Message", message);

    if (typeof window !== "undefined") {
        const messageStr = typeof message === 'string' ? message : String(message || '');
        if (messageStr && messageStr.includes("IX_Users_1") && messageStr.includes("duplicate key")) {
            toast.error(window.localStorage.getItem("language") === "en" ? "Duplicate login name exists" : "Хэрэглэгчийн нэр давхацсан байна");
        } else if (messageStr && messageStr.includes("Could not allocate a new page for database 'tempdb'" ) && messageStr.includes("insufficient disk space")) {
            // Handle SQL Server disk space error
            const friendlyMessage = window.localStorage.getItem("language") === "en" 
                ? "Database server is experiencing disk space issues. Please contact your system administrator." 
                : "Өгөгдлийн сангийн сервер диск зайн асуудалтай байна. Системийн админтай холбогдоно уу.";
            toast.error(friendlyMessage);
            // Still throw the error but with a more user-friendly message
            throw new Error(friendlyMessage);
        } else {
            toast(messageStr);
        }
    }
    const messageStr = typeof message === 'string' ? message : String(message || '');
    throw new Error(messageStr);
};

export default catchAxiosError;
