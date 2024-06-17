import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/accounting";
export const accountListUrl = `${urlPrefix}/Account/List`;

export const AccountListSWR = () => {
    const values = {
        AccountTypeID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(accountListUrl, fetcher);
};

export const AccountTypeAPI = {
    get: async (id: any) => {
        const values = {
            AccountTypeID: id,
        };

        const res = await axios.post(accountListUrl, values);

        return res.data.JsonData;
    },
};
