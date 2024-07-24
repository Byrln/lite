import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/PackageRoom";
export const listUrl = `${urlPrefix}/List`;

export const PackageRoomSWR = (packageId: any, search: any = {}) => {
    if (packageId) {
        search.PackageID = Number(packageId);
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const PackageRoomAPI = {
    get: async (id: any) => {
        const values = {
            PackageID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/InsertWU`,
            values
        );

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
            PackageID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            PackageID: id,
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
