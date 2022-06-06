import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/RateType";
export const listUrl = `${urlPrefix}/List`;

export const RateTypeSWR = () => {
    const values = {
        RateTypeID: 0,
        ChannelID: 0,
        SearchStr: "",
        Status: false,
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};

export const RateTypeAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),

    new: async (values: any) => {
        const { data, status } = await axios.post(urlPrefix, values);

        return {
            data,
            status,
        };
    },

    update: async (id: any, values: any) => {
        const { data, status } = await axios.put(`${urlPrefix}/${id}`, values);

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
};
