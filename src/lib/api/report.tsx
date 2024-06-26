import useSWR from "swr";
import axios from "lib/utils/axios";
import { date } from "yup/lib/locale";
import moment from "moment";
import { daysInMonth } from "lib/utils/helpers";
import { dateStringToObj } from "lib/utils/helpers";

const urlPrefix = "/api/Report";
export const balanceUrl = `${urlPrefix}/Balance`;
export const checkedOutDetailedUrl = `${urlPrefix}/CheckedOut/Detailed`;
export const breakfastUrl = `${urlPrefix}/Breakfast`;
export const monthlyUrl = `${urlPrefix}/Monthly`;
export const stayViewUrl = `${urlPrefix}/StayView1`;
export const availableRoomsUrl = `${urlPrefix}/AvailableRooms`;
export const dailyInfoUrl = `${urlPrefix}/DailyInfo`;
export const dailyInfo2Url = `${urlPrefix}/DailyInfo2`;
export const interAgencyUrl = `${urlPrefix}/InterAgency`;
export const dailyChargesPaymentSummaryUrl = `${urlPrefix}/DailyChargesPayment/Summary`;
export const reservationDailyDetailUrl = `${urlPrefix}/Reservation/DailyDetail`;
export const printInvoiceDetailedUrl = `${urlPrefix}/PrintInvoice/Detailed`;
export const printInvoiceSummaryUrl = `${urlPrefix}/PrintInvoice/Summary`;
export const dailyArrivalUrl = `${urlPrefix}/Daily/Arrival`;
export const dailyDepartureUrl = `${urlPrefix}/Daily/Departure`;
export const breakfast2Url = `${urlPrefix}/Breakfast2`;
export const nightAuditSummaryUrl = `${urlPrefix}/NightAudit/Summary`;
export const nightAuditRoomChargeUrl = `${urlPrefix}/NightAudit/RoomCharge`;
export const nightAuditCheckedOutUrl = `${urlPrefix}/NightAudit/CheckedOut`;
export const nightAuditPaymentSummaryUrl = `${urlPrefix}/NightAudit/Payment/Summary`;
export const nightAuditPaymentDetailUrl = `${urlPrefix}/NightAudit/Payment/Detail`;
export const cancelUrl = `${urlPrefix}/CancelReport`;
export const monthlyRoomChargeUrl = `${urlPrefix}/Monthly/RoomCharge`;
export const extraChargeDetailedUrl = `${urlPrefix}/ExtraCharge/Detail`;
export const extraChargeSummaryUrl = `${urlPrefix}/ExtraCharge/Summary`;
export const monthlyRevenueUrl = `${urlPrefix}/Monthly/Revenue`;
export const receptionCheckedInUrl = `${urlPrefix}/Reception/CheckedIn`;
export const receptionCheckedOutUrl = `${urlPrefix}/Reception/CheckedOut`;
export const receptionPaymentSummaryUrl = `${urlPrefix}/Reception/Payment/Summary`;
export const receptionPaymentDetailUrl = `${urlPrefix}/Reception/Payment/Detail`;
export const receptionRoomChargeUrl = `${urlPrefix}/Reception/RoomCharge`;
export const receptionExtraChargeUrl = `${urlPrefix}/Reception/ExtraCharge`;
export const receptionDueOutUrl = `${urlPrefix}/Reception/DueOut`;
export const receptionCancelVoidNoShowUrl = `${urlPrefix}/Reception/CancelVoidNoShow`;
export const extraChargeSessionUrl = `${urlPrefix}/ExtraCharge/Session`;
export const reservationListUrl = `${urlPrefix}/Reservation/List`;
export const reportFolioByReceptionUrl = `${urlPrefix}/ReportFolioByReception`;

export const ReportBalanceSWR = (search: any, workingDate: any) => {
    let tempSearch = {
        StartDate:
            moment(search.StartDate, "YYYY-MM-DD")
                .format("YYYY-MM-DD")
                .toString() +
            " " +
            (search.StartTime ? search.StartTime.toString() + ":00" : ":00"),
        EndDate:
            moment(search.EndDate, "YYYY-MM-DD")
                .format("YYYY-MM-DD")
                .toString() +
            " " +
            (search.EndTime ? search.EndTime.toString() + ":59" : ":59"),
        CustomerID: Number(search.CustomerID),
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(balanceUrl, fetcher);
};

export const ReportCancelSWR = (search: any, TransactionStatusID: any) => {
    let tempSearch = {
        StartDate: moment(search.StartDate, "YYYY-MM-DD"),
        EndDate: moment(search.EndDate, "YYYY-MM-DD"),
        TransactionStatusID: TransactionStatusID,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(cancelUrl, fetcher);
};

export const CheckedOutDetailedSWR = (search: any, workingDate: any) => {
    let tempSearch = {
        StartDate: moment(search.StartDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString(),
        EndDate: moment(search.EndDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString(),
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(checkedOutDetailedUrl, fetcher);
};

export const DailyChargesPaymentSummarySWR = (
    search: any,
    sessions: any,
    IsSession: any
) => {
    let tempSearch: any = {
        SessionIDs: [],
        StartDate: moment(search.CurrDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
        EndDate: moment(search.CurrDate).endOf("month").format("YYYY-MM-DD"),
        IsSession: IsSession,
    };

    sessions.forEach((session: any) => {
        tempSearch.SessionIDs.push({
            ID: session,
        });
    });

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(dailyChargesPaymentSummaryUrl, fetcher);
};

export const ReportFolioByReceptionUrlSWR = (search: any, sessions: any) => {
    let tempSearch: any = {
        SessionIDs: [],
        StartDate: moment(search.CurrDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
        EndDate: moment(search.CurrDate).endOf("month").format("YYYY-MM-DD"),
    };

    sessions.forEach((session: any) => {
        tempSearch.SessionIDs.push({
            ID: session,
        });
    });

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(reportFolioByReceptionUrl, fetcher);
};

export const ReservationDailyDetailSWR = (search: any, workingDate: any) => {
    let tempSearch = {
        StartDate:
            moment(search.StartDate, "YYYY-MM-DD")
                .format("YYYY-MM-DD")
                .toString() + " 00:00:00",
        EndDate:
            moment(search.StartDate, "YYYY-MM-DD")
                .add(1, "days")
                .format("YYYY-MM-DD")
                .toString() + " 00:00:00",
        CustomerID: search.CustomerID ? Number(search.CustomerID) : null,
        RoomTypeID: search.RoomTypeID ? Number(search.RoomTypeID) : null,
        RoomID: search.RoomID ? Number(search.RoomID) : null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(reservationDailyDetailUrl, fetcher);
};

export const InterAgencyUrl = (search: any) => {
    let tempSearch = {
        StartDate: `${moment(search.StartDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString()} 00:00:00`,
        EndDate: `${moment(search.EndDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString()} 23:59:59`,
        CustomerID: search.CustomerID ? Number(search.CustomerID) : null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(interAgencyUrl, fetcher);
};
export const BreakfastSWR = (search: any, workingDate: any) => {
    let tempSearch = {
        CurrDate: moment(search.CurrDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString(),
        Mandatory: search.Mandatory,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(breakfastUrl, fetcher);
};

export const MonthlySWR = (search: any) => {
    let tempSearch = {
        Year: moment(search.CurrDate, "YYYY-MM-DD").year(),
        Month: 11,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(monthlyUrl, fetcher);
};

export const DailyInfoSWR = () => {
    const fetcher = async (url: any) =>
        await axios.post(url).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(dailyInfoUrl, fetcher);
};

export const DailyInfo2SWR = (search: any, workingDate: any) => {
    if (!search.CurrDate) {
        search.CurrDate = workingDate;
    }
    search.CurrDate = moment(
        dateStringToObj(moment(search.CurrDate).format("YYYY-MM-DD")),
        "YYYY-MM-DD"
    );

    let tempValue = { CurrDate: search.CurrDate };

    const fetcher = async (url: any) =>
        await axios.post(url, tempValue).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(dailyInfo2Url, fetcher);
};

export const StayViewSWR = (search: any) => {
    let tempSearch = {
        CurrDate: `${moment(search.CurrDate, "YYYY-MM-DD").year()}-${
            moment(search.CurrDate, "YYYY-MM-DD").month() + 1
        }-01`,
        NumberOfDays:
            daysInMonth(
                moment(search.CurrDate, "YYYY-MM-DD").month() + 1,
                moment(search.CurrDate, "YYYY-MM-DD").year()
            ) - 1,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(stayViewUrl, fetcher);
};

export const MonthlyRoomChargeSWR = (search: any) => {
    let tempSearch = {
        StartDate: moment(search.CurrDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
        EndDate: moment(search.CurrDate).endOf("month").format("YYYY-MM-DD"),
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(monthlyRoomChargeUrl, fetcher);
};

export const AvailableRoomsSWR = (search: any) => {
    let tempSearch = {
        CurrDate: moment(search.CurrDate).format("YYYY-MM-DD"),
        NumberOfDays:
            daysInMonth(
                moment(search.CurrDate, "YYYY-MM-DD").month() + 1,
                moment(search.CurrDate, "YYYY-MM-DD").year()
            ) - 1,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(availableRoomsUrl, fetcher);
};

export const ReservationListSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(reservationListUrl, fetcher);
};

export const NightAuditSummarySWR = (search: any) => {
    let tempSearch = {
        CurrDate: moment(search.CurrDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString(),
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(nightAuditSummaryUrl, fetcher);
};

export const ReportAPI = {
    breakfast: async (search: any) => {
        const res = await axios.post(`${breakfastUrl}`, search);

        return res.data.JsonData;
    },
    dailyArrival: async (search: any) => {
        const res = await axios.post(`${dailyArrivalUrl}`, search);

        return res.data.JsonData;
    },
    dailyDeparture: async (search: any) => {
        const res = await axios.post(`${dailyDepartureUrl}`, search);

        return res.data.JsonData;
    },

    breakfast2: async (search: any) => {
        const res = await axios.post(`${breakfast2Url}`, search);

        return res.data.JsonData;
    },

    invoiceDetailed: async (search: any) => {
        const res = await axios.post(`${printInvoiceDetailedUrl}`, search);

        return res.data.JsonData;
    },

    invoiceSummary: async (search: any) => {
        const res = await axios.post(`${printInvoiceSummaryUrl}`, search);

        return res.data.JsonData;
    },

    nightAuditSummary: async (search: any) => {
        let tempSearch = {
            CurrDate: moment(search.CurrDate, "YYYY-MM-DD")
                .format("YYYY-MM-DD")
                .toString(),
        };

        const res = await axios.post(`${nightAuditSummaryUrl}`, tempSearch);

        return res.data.JsonData;
    },

    nightAuditRoomCharge: async (search: any) => {
        let tempSearch = {
            CurrDate: moment(search.CurrDate, "YYYY-MM-DD")
                .format("YYYY-MM-DD")
                .toString(),
        };

        const res = await axios.post(`${nightAuditRoomChargeUrl}`, tempSearch);

        return res.data.JsonData;
    },

    nightAuditCheckedOut: async (search: any) => {
        let tempSearch = {
            CurrDate: moment(search.CurrDate, "YYYY-MM-DD")
                .format("YYYY-MM-DD")
                .toString(),
        };

        const res = await axios.post(`${nightAuditCheckedOutUrl}`, tempSearch);

        return res.data.JsonData;
    },

    nightAuditPaymentSummary: async (search: any) => {
        let tempSearch = {
            CurrDate: moment(search.CurrDate, "YYYY-MM-DD")
                .format("YYYY-MM-DD")
                .toString(),
        };

        const res = await axios.post(
            `${nightAuditPaymentSummaryUrl}`,
            tempSearch
        );

        return res.data.JsonData;
    },

    nightAuditPaymentDetail: async (search: any) => {
        let tempSearch = {
            CurrDate: moment(search.CurrDate, "YYYY-MM-DD")
                .format("YYYY-MM-DD")
                .toString(),
        };

        const res = await axios.post(
            `${nightAuditPaymentDetailUrl}`,
            tempSearch
        );

        return res.data.JsonData;
    },

    extraChargeDetailed: async (search: any) => {
        let tempSearch = {
            StartDate: `${search.StartDate} 00:00:00`,
            EndDate: `${search.EndDate} 23:59:59`,
            RoomChargeTypeGroupID: search.RoomChargeTypeGroupID
                ? search.RoomChargeTypeGroupID
                : null,
            RoomChargeTypeID: search.RoomChargeTypeID
                ? search.RoomChargeTypeID
                : null,
            RoomTypeID: search.RoomTypeID ? search.RoomTypeID : null,
            RoomID: search.RoomID ? search.RoomID : null,
            UserID: search.UserID ? search.UserID : null,
        };

        const res = await axios.post(`${extraChargeDetailedUrl}`, tempSearch);

        return res.data.JsonData;
    },

    extraChargeSummary: async (search: any) => {
        let tempSearch = {
            StartDate: `${search.StartDate} 00:00:00`,
            EndDate: `${search.EndDate} 23:59:59`,
            RoomChargeTypeGroupID: search.RoomChargeTypeGroupID
                ? search.RoomChargeTypeGroupID
                : null,
            RoomChargeTypeID: search.RoomChargeTypeID
                ? search.RoomChargeTypeID
                : null,
            RoomTypeID: search.RoomTypeID ? search.RoomTypeID : null,
            RoomID: search.RoomID ? search.RoomID : null,
            UserID: search.UserID ? search.UserID : null,
        };

        const res = await axios.post(`${extraChargeSummaryUrl}`, tempSearch);

        return res.data.JsonData;
    },

    monthlyRevenue: async (search: any) => {
        let tempSearch = {
            Year: moment(search.CurrDate).year(),
            Month: moment(search.CurrDate).month() + 1,
            Lang: "mn",
        };

        const res = await axios.post(`${monthlyRevenueUrl}`, tempSearch);

        return res.data.JsonData;
    },

    receptionPaymentSummary: async (SessionID: any) => {
        const res = await axios.post(`${receptionPaymentSummaryUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },

    receptionPaymentDetail: async (SessionID: any) => {
        const res = await axios.post(`${receptionPaymentDetailUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },

    receptionRoomCharge: async (SessionID: any) => {
        const res = await axios.post(`${receptionRoomChargeUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },

    receptionCheckedIn: async (SessionID: any) => {
        const res = await axios.post(`${receptionCheckedInUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },

    receptionCheckedOut: async (SessionID: any) => {
        const res = await axios.post(`${receptionCheckedOutUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },

    receptionExtraCharge: async (SessionID: any) => {
        const res = await axios.post(`${receptionExtraChargeUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },

    receptionDueOut: async (SessionID: any) => {
        const res = await axios.post(`${receptionDueOutUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },

    receptionCancelVoidNoShow: async (SessionID: any) => {
        const res = await axios.post(`${receptionCancelVoidNoShowUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },
    extraChargeSession: async (SessionID: any) => {
        const res = await axios.post(`${extraChargeSessionUrl}`, {
            SessionID: SessionID,
        });

        return res.data.JsonData;
    },
};
