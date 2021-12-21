import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/RoomType";
export const listUrl = `${urlPrefix}/List`;

export const RoomTypeSWR = () => {
    const values = {
        RoomTypeID: 0,
        SearchStr: "",
        EmptyRow: "0",
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let roomTypes = JSON.parse(res.data.JsonData);
            return roomTypes;
        });

    return useSWR(listUrl, fetcher);
};

export const RoomTypeAPI = {
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
            RoomTypeId: id,
        });

        return {
            data,
            status,
        };
    },
};
