import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Customer";
export const listUrl = `${urlPrefix}/List`;
export const CustomerSWR = (search: any) => {
    const values = {
        CustomerID: search.CustomerID ? search.CustomerID : 0,
        CustomerTypeID: 0,
        CustomerGroupID: search.CustomerGroupID ? search.CustomerGroupID : 0,
        SearchStr: "",
        CountryID: 0,
        EmptyRow: null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let currencies = res.data.JsonData;
            return currencies;
        });

    return useSWR(listUrl, fetcher);
};

export const CustomerAPI = {
    get: async (id: any) => {
        const values = {
            CustomerID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
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
};
