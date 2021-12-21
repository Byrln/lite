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
        await axios.post(url, values).then((res: any) => {
            let taxes = JSON.parse(res.data.JsonData);
            return taxes;
        });

    return useSWR(listUrl, fetcher);
};

export const TaxAPI = {
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
            TaxID: id,
        });

        return {
            data,
            status,
        };
    },
};
