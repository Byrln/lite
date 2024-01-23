import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/User";
export const listUrl = `${urlPrefix}/ListByUser`;
export const listByRoleUrl = `${urlPrefix}/ListByRole`;

export const UserSWR = (search: any) => {
    if (!search.UserID) {
        search.UserID = null;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const UserByRoleSWR = (search: any) => {
    if (!search.UserID) {
        search.UserID = null;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listByRoleUrl, fetcher);
};

export const UserAPI = {
    get: async (id: any) => {
        const values = {
            UserID: id,
        };

        const res = await axios.post(`${urlPrefix}/DetailByUserID`, values);

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
            UserID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            UserID: id,
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
