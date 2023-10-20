import useSWR from "swr";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/DashBoard";
export const listUrl = `${urlPrefix}/Daily`;

const groupBy = (items: any, key: any) =>
    items.reduce(
        (result: any, item: any) => ({
            ...result,
            [item[key]]: [...(result[item[key]] || []), item],
        }),
        {}
    );

export const DashboardSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => {
            let roomTypes = groupBy(res.data.JsonData, "ParameterGroupName");
            var result = Object.values(roomTypes);

            return result;
        });

    return useSWR(listUrl, fetcher);
};
