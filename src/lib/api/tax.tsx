import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Tax";
export const listUrl = `${urlPrefix}/List`;

export const TaxSWR = () => {
    const values = {
        TaxID: 0,
        SearchStr: "",
        Status: false,
        IsCurrent: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const TaxAPI = {
    list: async () => {
        const values = {
            TaxID: 0,
            SearchStr: "",
            Status: false,
            IsCurrent: false,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

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
