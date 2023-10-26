import useSWR from "swr";
import { format } from "date-fns";

import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/DashBoard";
export const dailyUrl = `${urlPrefix}/Daily`;
export const weeklyUrl = `${urlPrefix}/Weekly`;

const groupBy = (items: any, key: any) =>
    items.reduce(
        (result: any, item: any) => ({
            ...result,
            [item[key]]: [...(result[item[key]] || []), item],
        }),
        {}
    );

export const DashboardSWR = (dashboardType: any, date: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(url, {
                CurrDate: format(date, "yyyy-MM-dd"),
            })
            .then((res: any) => {
                let roomTypes = groupBy(
                    res.data.JsonData,
                    "ParameterGroupName"
                );
                var result = Object.values(roomTypes);

                return result;
            });

    return useSWR(dashboardType == "daily" ? dailyUrl : weeklyUrl, fetcher);
};
