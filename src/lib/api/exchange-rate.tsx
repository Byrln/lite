import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Currency";
export const listUrl = `${urlPrefix}/list`;

export const ExchangeRateSWR = () => {
    const values = {
        CurrencyID: null,
        CountryID: null,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};

export const ExchangeRateAPI = {
    get: async (id: any) => {
        const values = {
            ExchangeRateID: id,
        };

        const res = await axios.post(listUrl, values);

        return JSON.parse(res.data.JsonData);
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

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
