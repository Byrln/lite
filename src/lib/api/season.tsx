import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Season";
export const listUrl = `${urlPrefix}/List`;

export const SeasonSWR = () => {
    const values = {
        SeasonID: 0,
        SearchStr: "",
        Status: false,
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let rateTypes = JSON.parse(res.data.JsonData);
            return rateTypes;
        });

    return useSWR(listUrl, fetcher);
};

export const SeasonAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),

    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

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
            SeasonID: id,
        });

        return {
            data,
            status,
        };
    },
};
