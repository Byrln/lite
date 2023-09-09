import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Edition";
export const listUrl = `${urlPrefix}/List`;

export const EditionSWR = () => {
    const fetcher = async (url: any) =>
        await axios.post(url).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const EditionAPI = {
    get: async (id: any) => {
        const values = {
            PackageID: id,
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
            PackageID: id,
        });

        return {
            data,
            status,
        };
    },
};
