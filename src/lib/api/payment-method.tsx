import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/PaymentMethod";
export const listUrl = `${urlPrefix}/List`;

export const PaymentMethodSWR = (PaymentMethodGroupID = 0) => {
    const values = {
        PaymentMethodGroupID: PaymentMethodGroupID,
        SearchStr: "",
        IsCustomerRelated: false,
        Status: false,
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const PaymentMethodAPI = {
    get: async (id: any) => {
        const values = {
            PaymentMethodID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    list: async (values: any) => {
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
            PaymentMethodID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            PaymentMethodID: id,
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
