import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/HouseKeeping";
export const listCurrentUrl = `${urlPrefix}/Current`;
export const listRoomUrl = `${urlPrefix}/Rooms`;

export const HouseKeepingCurrentSWR = () => {
    const values = {
        RoomTypeID: null,
        RoomID: null,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listCurrentUrl, fetcher);
};

export const HouseKeepingRoomSWR = () => {
    const values = {
        RoomTypeID: null,
        RoomID: null,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

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
};
