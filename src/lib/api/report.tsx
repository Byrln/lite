import useSWR from "swr";
import axios from "lib/utils/axios";
import { date } from "yup/lib/locale";
import moment from "moment";

const urlPrefix = "/api/Report";
export const balanceUrl = `${urlPrefix}/Balance`;
export const checkedOutDetailedUrl = `${urlPrefix}/CheckedOut/Detailed`;
export const breakfastUrl = `${urlPrefix}/Breakfast`;

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
        // CustomerID: Number(search.CustomerID),
    };

    const fetcher = async (url: any) =>
        await axios.post(url, tempSearch).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(checkedOutDetailedUrl, fetcher);
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

export const ReportAPI = {
    breakfast: async (search: any) => {
        const res = await axios.post(`${breakfastUrl}`, search);

        return res.data.JsonData;
    },
};
