import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/accounting";
export const accountListUrl = `${urlPrefix}/Account/List`;
export const extraChargeUrl = `${urlPrefix}/ExtraCharge/List`;
export const accountGroupUrl = `${urlPrefix}/Account/Group`;
export const detailExtUrl = `${urlPrefix}/Account/DetailExt`;

export const AccountListSWR = (search: any) => {
    if (search.IsDebit && search.IsDebit != 0) {
        if (search.IsDebit == 1) {
            search.IsDebit = true;
        } else {
            search.IsDebit = false;
        }
    }
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(accountListUrl, fetcher);
};

export const ExtraChargeSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(extraChargeUrl, fetcher);
};

export const AccountingAPI = {
    get: async (id: any) => {
        const values = {
            AccountTypeID: id,
        };

        const res = await axios.post(accountListUrl, values);

        return res.data.JsonData;
    },

    detailExt: async (search: any) => {
        const res = await axios.post(detailExtUrl, search);

        return res.data.JsonData;
    },

    accountGroup: async (IsDebit: any) => {
        const values = {
            IsDebit: IsDebit,
        };

        const res = await axios.post(accountGroupUrl, values);

        return res.data.JsonData;
    },
};
