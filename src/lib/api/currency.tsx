import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Currency";
export const listUrl = `${urlPrefix}/List`;

export const CurrencySWR = () => {
    const values = {
        HasExchangeRate: null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let currencies = JSON.parse(res.data.JsonData);
            return currencies;
        });

    return useSWR(listUrl, fetcher);
};

export const CurrenctAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),
};
