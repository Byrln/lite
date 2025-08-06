import useSWR from "swr";
import moment from "moment";

import axios from "lib/utils/axios";
import { dateStringToObj } from "lib/utils/helpers";

const urlPrefix = "/api/hotel/BankAccount";
export const listUrl = `${urlPrefix}/List`;
export const detailUrl = `${urlPrefix}/Detail`;

export const BankAccountSWR = (search: any) => {
    if (!search.Status) {
        search.Status = false;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = false;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const BankAccountAPI = {
    get: async (id: any) => {
        const values = {
            BankAccountID: id,
        };

        const res = await axios.post(detailUrl, values);

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
            BankAccountID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            BankAccountID: id,
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

    updateStatus: async (id: any, status: boolean) => {
        const { data, status: responseStatus } = await axios.post(`${urlPrefix}/UpdateStatus`, {
            BankAccountID: id,
            Status: status,
        });

        return {
            data,
            status: responseStatus,
        };
    },
};
