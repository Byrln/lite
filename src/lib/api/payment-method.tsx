import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/PaymentMethod";
export const listUrl = `${urlPrefix}/List`;

export const PaymentMethodSWR = () => {
    const values = {
        PaymentMethodGroupID: 0,
        SearchStr: "",
        IsCustomerRelated: false,
        Status: false,
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let paymentMethods = JSON.parse(res.data.JsonData);
            return paymentMethods;
        });

    return useSWR(listUrl, fetcher);
};

export const PaymentMethodAPI = {
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
            PaymentMethodID: id,
        });

        return {
            data,
            status,
        };
    },
};
