import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/AmenityType";
export const listUrl = `${urlPrefix}/List`;

export const AmenityTypeSWR = () => {
    const values = {
        AmenityTypeID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const AmenityTypeAPI = {
    get: async (id: any) => {
        const values = {
            AmenityTypeID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },
};
