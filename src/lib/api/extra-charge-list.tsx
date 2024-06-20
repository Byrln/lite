import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Accounting";
export const extrachargeListUrl = `${urlPrefix}/ExtraCharge/List`;

export const ExtraChargeListSWR = (search: any) => {
    const values = {
        ExtraChargeTypeID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(extrachargeListUrl, fetcher);
};

export const ExtraChargeTypeAPI = {
    get: async (id: any) => {
        const values = {
            ExtraChargeTypeID: id,
        };

        const res = await axios.post(extrachargeListUrl, values);

        return res.data.JsonData;
    },
};
