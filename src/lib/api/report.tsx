import useSWR from "swr";
import axios from "lib/utils/axios";
import { date } from "yup/lib/locale";

const urlPrefix = "/api/Report";
export const balanceUrl = `${urlPrefix}/Balance`;

export const ReportBalanceSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => {
            let list = res.data.JsonData;
            return list;
        });

    return useSWR(balanceUrl, fetcher);
};
