import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/RoomStatus";
export const listUrl = `${urlPrefix}/List`;

export const RoomStatusSWR = (search: any) => {
    if (!search.RoomTypeID) {
        search.RoomTypeID = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const RoomStatusAPI = {
    get: async (id: any) => {
        const values = {
            RoomStatusID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
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
};
