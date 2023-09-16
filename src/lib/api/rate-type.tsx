import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/RateType";
export const listUrl = `${urlPrefix}/List`;

export const RateTypeSWR = (search: any) => {
    if (!search.RateTypeID) {
        search.RateTypeID = 0;
    }
    if (!search.ChannelID) {
        search.ChannelID = 0;
    }
    if (!search.Status) {
        search.Status = false;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = false;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const BaseRateSWR = (id: any) => {
    const values = {
        RateTypeID: id,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/BaseRateList`, fetcher);
};

export const RateTypeAPI = {
    get: async (id: any) => {
        const values = {
            RateTypeID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    baseRateList: async (id: any) => {
        const values = {
            RateTypeID: id,
        };

        const res = await axios.post(`${urlPrefix}/BaseRateList`, values);

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
            RateTypeID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            RateTypeID: id,
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

    BaseRateInsertWUList: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/BaseRateInsertWUList`,
            values
        );

        return {
            data,
            status,
        };
    },
};
