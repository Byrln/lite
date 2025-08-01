import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Accounting";
export const salestListUrl = `${urlPrefix}/Sales`;

export const SalesListSWR = (search: any) => {
    const values = {
        SalesTypeID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

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
