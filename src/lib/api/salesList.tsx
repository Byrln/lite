import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/sales";
export const salestListUrl = `${urlPrefix}/Account/Sales`;

export const SalesListSWR = () => {
    const values = {
        SalesTypeID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(salestListUrl, fetcher);
};

export const SalesTypeAPI = {
    get: async (id: any) => {
        const values = {
            SalesTypeID: id,
        };

        const res = await axios.post(salestListUrl, values);

        return res.data.JsonData;
    },
};
