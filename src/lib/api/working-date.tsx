import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/WorkingDate";
export const listUrl = `${urlPrefix}/Current`;

export const WorkingDateSWR = () => {
    const fetcher = async (url: any) =>
        await axios.post(url).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const WorkingDateAPI = {
    get: async (id: any) => {
        const values = {
            TaxID: id,
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

    newBulk: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/NewBulk`,
            values
        );

        return {
            data,
            status,
        };
    },

    reverse: async () => {
        const { data, status } = await axios.post(`${urlPrefix}/Reverse`);

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
            TaxID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            TaxID: id,
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
