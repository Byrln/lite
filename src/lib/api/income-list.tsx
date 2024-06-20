import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Accounting";
export const incomeListUrl = `${urlPrefix}/Income`;

export const IncomeListSWR = (search: any) => {
    const values = {
        IncomeTypeID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(incomeListUrl, fetcher);
};

export const IncomeTypeAPI = {
    get: async (id: any) => {
        const values = {
            IncomeTypeID: id,
        };

        const res = await axios.post(incomeListUrl, values);

        return res.data.JsonData;
    },
};
