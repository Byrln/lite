import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Customer";
export const listUrl = `${urlPrefix}/list`;

export const CompanyDatabaseSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const CompanyDatabaseAPI = {
    get: async (id: any) => {
        const values = {
            CompanyDatabaseID: id,
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
            CompanyDatabaseID: id,
        });

        return {
            data,
            status,
        };
    },
};
