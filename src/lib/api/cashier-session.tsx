import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/CashierSession";
export const listUrl = `${urlPrefix}/List`;
export const detailUrl = `${urlPrefix}/Detail`;
export const summaryUrl = `${urlPrefix}/Summary`;
export const activeUrl = `${urlPrefix}/Active`;

export const CashierSessionListSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const CashierSessionActiveSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => res.data.JsonData);

    return useSWR(activeUrl, fetcher);
};

export const CashierSessionSummarySWR = (id: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(url, { SessionID: id })
            .then((res: any) => res.data.JsonData);

    return useSWR(summaryUrl, fetcher);
};

export const CashierSessionDetailSWR = (id: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(url, { SessionID: id })
            .then((res: any) => res.data.JsonData);

    return useSWR(detailUrl, fetcher);
};

export const CashierSessionAPI = {
    list: async (search: any) => {
        const res = await axios.post(listUrl, search);

        return res.data.JsonData;
    },

    get: async (id: any) => {
        const values = {
            SessionID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(
            values.isAdd == true
                ? `${urlPrefix}/CashAdd`
                : `${urlPrefix}/CashRemove`,
            values
        );

        return {
            data,
            status,
        };
    },

    end: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/End`, values);

        return {
            data,
            status,
        };
    },

    start: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Start`, values);

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
            SessionID: id,
        });

        return {
            data,
            status,
        };
    },

    detail: async (id: any) => {
        const values = {
            SessionID: id,
        };

        const res = await axios.post(detailUrl, values);

        return res.data.JsonData;
    },

    summary: async (id: any) => {
        const values = {
            SessionID: id,
        };

        const res = await axios.post(summaryUrl, values);

        return res.data.JsonData;
    },
};
