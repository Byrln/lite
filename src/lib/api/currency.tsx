import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Currency";
export const listUrl = `${urlPrefix}/List`;
export const exchangeHistoryUrl = `${urlPrefix}/ExchangeRate/History`;

export const CurrencySWR = () => {
    const values = {
        HasExchangeRate: null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let currencies = res.data.JsonData;
            return currencies;
        });

    return useSWR(listUrl, fetcher);
};

export const CurrencyExchangeRateHistorySWR = (values: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let currencies = res.data.JsonData;
            return currencies;
        });

    return useSWR(exchangeHistoryUrl, fetcher);
};

export const CurrenctAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),

    exchangeRate: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/ExchangeRate`,
            values
        );
        if (status != 200) {
            return [];
        }
        var list = data.JsonData;
        return list;
    },
};
