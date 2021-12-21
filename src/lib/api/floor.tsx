import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Floor";
export const listUrl = `${urlPrefix}/List`;

export const FloorSWR = () => {
    const values = {
        FloorID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let roomTypes = JSON.parse(res.data.JsonData);
            return roomTypes;
        });

    return useSWR(listUrl, fetcher);
};

export const FloorAPI = {
    new: async (values: any) => {
        const { data, status } = await axios.post(urlPrefix, values);

        return {
            data,
            status,
        };
    },
};
