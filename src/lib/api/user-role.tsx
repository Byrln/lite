import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/UserRole";
export const listUrl = `${urlPrefix}/List`;

export const UserRoleSWR = (search: any) => {
    if (!search.UserRoleID) {
        search.UserRoleID = null;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const UserRolePrivilegeSWR = () => {
    const values = {
        UserRoleID: null,
        ActionGroupType: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/GetPrivileges`, fetcher);
};

export const UserRoleAPI = {
    get: async (id: any) => {
        const values = {
            UserRoleID: id,
        };

        const res = await axios.post(`${urlPrefix}/Detail`, values);

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
            UserRoleID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            UserRoleID: id,
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
