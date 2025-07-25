import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Notification";
export const listUrl = `${urlPrefix}/User`;

export const NotificationSWR = () => {
    const values = {
        NotificationID: null,
        EmptyRow: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const NotificationTypeSWR = () => {
    const fetcher = async (url: any) =>
        await axios.post(url).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Type`, fetcher);
};

export const NotificationUserItemSWR = (values: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/UserItem`, fetcher);
};

export const NotificationUserRoleSWR = (notificationTypeID = 0) => {
    let values: any = { NotificationTypeID: notificationTypeID };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/UserRole`, fetcher);
};

export const NotificationAPI = {
    get: async (id: any) => {
        const values = {
            NotificationID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/User/InsertWU`,
            values
        );

        return {
            data,
            status,
        };
    },

    update: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/User/Update`,
            values
        );

        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/User/Delete`, {
            NotificationID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            NotificationID: id,
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
