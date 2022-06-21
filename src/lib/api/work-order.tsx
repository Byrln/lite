import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Promotion";
export const listUrl = `${urlPrefix}/list`;

export const WorkOrderSWR = (ChannelId: number) => {
    const values = {
        WorkOrderID: null,
        ChannelId: ChannelId,
        EmptyRow: 0,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};

export const WorkOrderAPI = {
    get: async (id: any) => {
        const values = {
            WorkOrderID: id,
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
            WorkOrderID: id,
        });

        return {
            data,
            status,
        };
    },
};
