import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/accounting/Customer";
export const listUrl = `/api/Customer/List`;
export const listUrl2 = `/api/Accounting/Customer/List`;
export const updateUrl = `${urlPrefix}/InsertWu`;

export const AccountingCustomerSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const AccountingCustomerAPI = {
    get: async (id: any) => {
        const values = {
            CustomerID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    update: async (values: any) => {
        let tempValue = {
            CustomerID: values.CustomerID ? values.CustomerID : null,
            CustomerCode: values.CustomerCode ? values.CustomerCode : null,
            CustomerType: values.CustomerType ? values.CustomerType : null,
        };
        const res = await axios.post(updateUrl, tempValue);

        return res.data.JsonData;
    },
};
