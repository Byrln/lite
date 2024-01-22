import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Currency";
export const listUrl = `${urlPrefix}/list`;

export const ExchangeRateSWR = () => {
    const values = {
        IsCurrent: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const ExchangeRateAPI = {
    get: async (id: any, CountryID: any) => {
        const values = {
            CurrencyID: id,
            CountryID: CountryID ? CountryID : null,
        };

        const res = await axios.post(`${urlPrefix}/ExchangeRate`, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/ExchangeRate/InsertWU`,
            values
        );

        return {
            data,
            status,
        };
    },

    update: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Update`,
            values
        );

        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Delete`, {
            ExchangeRateID: id,
        });

        return {
            data,
            status,
        };
    },
};
