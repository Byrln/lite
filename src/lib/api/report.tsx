import useSWR from "swr";
import axios from "lib/utils/axios";
import { date } from "yup/lib/locale";
import moment from "moment";
import { daysInMonth } from "lib/utils/helpers";

const urlPrefix = "/api/Report";
export const balanceUrl = `${urlPrefix}/Balance`;
export const checkedOutDetailedUrl = `${urlPrefix}/CheckedOut/Detailed`;
export const breakfastUrl = `${urlPrefix}/Breakfast`;
export const monthlyUrl = `${urlPrefix}/Monthly`;
export const stayViewUrl = `${urlPrefix}/StayView1`;
export const dailyInfoUrl = `${urlPrefix}/DailyInfo`;
export const interAgencyUrl = `${urlPrefix}/InterAgency`;
export const dailyChargesPaymentSummaryUrl = `${urlPrefix}/DailyChargesPayment/Summary`;
export const reservationDailyDetailUrl = `${urlPrefix}/Reservation/DailyDetail`;

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

export const CheckedOutDetailedSWR = (search: any, workingDate: any) => {
    let tempSearch = {
        StartDate: moment(search.StartDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString(),
        EndDate: moment(search.EndDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString(),
        CustomerID: search.CustomerID ? Number(search.CustomerID) : null,
        RoomTypeID: search.RoomTypeID ? Number(search.RoomTypeID) : null,
        RoomID: search.RoomID ? Number(search.RoomID) : null,
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
    workingDate: any
) => {
    let tempSearch = {
        StartDate: moment(search.StartDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString(),
        EndDate: moment(search.EndDate, "YYYY-MM-DD")
            .format("YYYY-MM-DD")
            .toString(),
        CustomerID: search.CustomerID ? Number(search.CustomerID) : null,
        RoomTypeID: search.RoomTypeID ? Number(search.RoomTypeID) : null,
        RoomID: search.RoomID ? Number(search.RoomID) : null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(dailyChargesPaymentSummaryUrl, fetcher);
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

export const StayViewSWR = (search: any) => {
    console.log("search.CurrDate", search.CurrDate);
    console.log(
        "search.CurrDate",
        moment(search.CurrDate, "YYYY-MM-DD").month()
    );

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

export const ReportAPI = {
    breakfast: async (search: any) => {
        const res = await axios.post(`${breakfastUrl}`, search);

        return res.data.JsonData;
    },
};
