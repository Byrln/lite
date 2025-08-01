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

export const GetPrivilegesSWR = () => {
    const fetcher = async (url: any) =>
        await axios
            .get(`${urlPrefix}/GetPrivileges`)
            .then((res: any) => res.data.JsonData);
    return useSWR(`${urlPrefix}/GetPrivileges`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000,
        errorRetryCount: 1,
        refreshInterval: 0
    });
};

export const GetPrivilegesByUserSWR = (value: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/GetPrivileges`, value)
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/GetPrivileges`, fetcher);
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
    getPrivileges: async () => {
        const res = await axios.get(`${urlPrefix}/GetPrivileges`);

        return res.data.JsonData;
    },

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

    setPassword: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/SetPassword`,
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

    savePrivileges: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/SavePrivileges`,
            values
        );

        return {
            data,
            status,
        };
    },

    changePassword: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/ChangePassword`,
            values
        );

        return {
            data,
            status,
        };
    },
};
