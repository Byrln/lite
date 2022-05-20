import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Customer";
export const listUrl = `${urlPrefix}/List`;

export const CustomerSWR = () => {
    const values = {
        CustomerID: null,
        CustomerTypeID: 0,
        CustomerGroupID: 0,
        SearchStr: "",
        CountryID: 0,
        EmptyRow: null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let currencies = JSON.parse(res.data.JsonData);
            return currencies;
        });

    return useSWR(listUrl, fetcher);
};

export const CustomerAPI = {
    // get: (id: any) => axios.get(`${urlPrefix}/${id}`),

    get: async (id: any) => {
        const values = {
            TransactionID: id,
        };
        const res = await axios.post(listUrl, values);

        console.log(res);

        var list = JSON.parse(res.data.JsonData);
        var item;

        console.log(list);

        if (list.length === 1) {
            item = list[0];
        } else {
            item = null;
        }
        return item;
    },
};
