import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/WorkingDate";
export const listUrl = `${urlPrefix}/Current`;

export const NightAuditSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};

export const NightAuditAPI = {
    get: async (id: any) => {
        const values = {
            NightAuditID: id,
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
            NightAuditID: id,
        });

        return {
            data,
            status,
        };
    },
};
