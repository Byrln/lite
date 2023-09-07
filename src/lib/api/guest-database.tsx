import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Guest";
export const listUrl = `${urlPrefix}/list`;

export const GuestdatabaseSWR = (search: any) => {
    // const values = {
    //     GuestID: null,
    //     CountryID: null,
    // };

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const GuestHistorySWR = (id: any) => {
    const values = {
        GuestID: id,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/History`, fetcher);
};

export const GuestHistorySummarySWR = (id: any) => {
    const values = {
        GuestID: id,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/HistorySummary`, fetcher);
};

export const GuestdatabaseAPI = {
    get: async (id: any) => {
        const values = {
            GuestID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
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
            GuestdatabaseID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            GuestdatabaseID: id,
            Status: checked,
        };

        const { data, status } = await axios.post(
            `${urlPrefix}/${apiUrl}`,
            values
        );

        return {
            data,
            status,
        };
    },
};
