import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Floor";
export const listUrl = `${urlPrefix}/List`;

export const FloorSWR = () => {
    const values = {
        FloorID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const FloorAPI = {
    get: async (id: any) => {
        const values = {
            FloorID: id,
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
};
