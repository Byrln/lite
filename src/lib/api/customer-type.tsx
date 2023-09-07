import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/CustomerType";
export const listUrl = `${urlPrefix}/List`;

export const CustomerTypeSWR = () => {
    const fetcher = async (url: any) =>
        await axios.post(url).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const CustomerTypeAPI = {
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
            CustomerGroupID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            CustomerGroupID: id,
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
