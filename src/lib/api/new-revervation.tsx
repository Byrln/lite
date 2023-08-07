import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Promotion";
export const listUrl = `${urlPrefix}/list`;

export const NewRevervationSWR = (ChannelId = null) => {
    const values = {
        NewRevervationID: null,
        ChannelId: ChannelId ? ChannelId : 0,
        EmptyRow: 0,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};

export const NewRevervationAPI = {
    get: async (id: any) => {
        const values = {
            NewRevervationID: id,
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
            NewRevervationID: id,
        });

        return {
            data,
            status,
        };
    },
};
