import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/RoomStatus";
export const listUrl = `${urlPrefix}/List`;

export const RoomStatusSWR = () => {
    const values = {
        RoomTypeID: 0,
        SearchStr: "",
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let roomStatus = JSON.parse(res.data.JsonData);
            return roomStatus;
        });

    return useSWR(listUrl, fetcher);
};

export const RoomStatusAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),

    new: async (values: any) => {
        const { data, status } = await axios.post(urlPrefix, values);

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
            RoomStatusID: id,
        });

        return {
            data,
            status,
        };
    },
};
