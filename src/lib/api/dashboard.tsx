import useSWR from "swr";
import { format } from "date-fns";

import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/DashBoard";
export const dailyUrl = `${urlPrefix}/Daily`;
export const weeklyUrl = `${urlPrefix}/Weekly`;
export const monthlyUrl = `${urlPrefix}/Monthly`;

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

                // Ensure we have exactly 3 groups for 3-column layout
                if (result.length === 2) {
                    // Split the second group into two parts for better 3-column display
                    const secondGroup = result[1] as any[];
                    if (secondGroup && secondGroup.length > 3) {
                        const midPoint = Math.ceil(secondGroup.length / 2);
                        const firstPart = secondGroup.slice(0, midPoint);
                        const secondPart = secondGroup.slice(midPoint);
                        result = [result[0], firstPart, secondPart];
                    } else {
                        // Add a third synthetic group for layout purposes
                        result.push([]);
                    }
                }

                return result;
            });

    return useSWR(
        dashboardType == "daily"
            ? dailyUrl
            : dashboardType == "weekly"
            ? weeklyUrl
            : monthlyUrl,
        fetcher
    );
};
