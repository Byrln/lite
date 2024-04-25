import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/HouseKeeping";
export const listCurrentUrl = `${urlPrefix}/Current`;
export const listRoomUrl = `${urlPrefix}/Rooms`;

export const HouseKeepingCurrentSWR = (values: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listCurrentUrl, fetcher);
};

export const HouseKeepingRoomSWR = (search: any) => {
    if (!search.RoomTypeID) {
        search.RoomTypeID = null;
    }
    if (!search.RoomID) {
        search.RoomID = null;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listRoomUrl, fetcher);
};

export const HouseKeepingAPI = {
    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

        return {
            data,
            status,
        };
    },

    update: async (values: any) => {
        if (!values.Description) {
            values.Description = "";
        }
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
            HouseKeepingID: id,
        });

        return {
            data,
            status,
        };
    },

    assign: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Assign`,
            values
        );

        return {
            data,
            status,
        };
    },

    unassign: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Unassign`, {
            RoomID: id,
        });

        return {
            data,
            status,
        };
    },

    roomCleaning: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Room/Cleaning`,
            values
        );

        return {
            data,
            status,
        };
    },
    roomCleaned: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Room/Cleaned`,
            values
        );

        return {
            data,
            status,
        };
    },
};
