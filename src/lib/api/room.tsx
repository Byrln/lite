import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Room";
export const listUrl = `${urlPrefix}/List`;

export const RoomSWR = () => {
    const values = {
        RoomID: 0,
        RoomTypeID: 0,
        FloorID: 0,
        SearchStr: "",
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let rooms = JSON.parse(res.data.JsonData);
            return rooms;
        });

    return useSWR(listUrl, fetcher);
};

export const RoomAPI = {
    get: async (id: any) => {
        const values = {
            RoomID: id,
        };

        const res = await axios.post(listUrl, values);

        return JSON.parse(res.data.JsonData);
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

        return {
            data,
            status,
        };
    },

    update: async (id: any, values: any) => {
        const { data, status } = await axios.put(`${urlPrefix}/${id}`, values);

        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Delete`, {
            RoomId: id,
        });

        return {
            data,
            status,
        };
    },
};
