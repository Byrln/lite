import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/CustomerGroup";
export const listUrl = `${urlPrefix}/List`;

export const CustomerGroupSWR = () => {
    const values = {
        CustomerGroupID: null,
        EmptyRow: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let currencies = JSON.parse(res.data.JsonData);
            return currencies;
        });

    return useSWR(listUrl, fetcher);
};

export const CustomerGroupAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),
};
