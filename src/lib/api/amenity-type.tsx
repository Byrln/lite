import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/AmenityType";
export const listUrl = `${urlPrefix}/List`;

export const AmenityTypeSWR = () => {
    const values = {
        AmenityTypeID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let amenityTypes = JSON.parse(res.data.JsonData);
            return amenityTypes;
        });

    return useSWR(listUrl, fetcher);
};

export const AmenityTypeAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),
};
