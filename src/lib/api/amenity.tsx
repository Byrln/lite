import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Amenity";
export const listUrl = `${urlPrefix}/List`;
export const roomTypeAmenityUrl = `${urlPrefix}/RoomTypeAmenity`;

export const AmenitySWR = () => {
    const values = {
        AmenityID: 0,
        SearchStr: "",
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let amenities = JSON.parse(res.data.JsonData);
            return amenities;
        });

    return useSWR(listUrl, fetcher);
};

export const RoomTypeAmenitySWR = () => {
    const values = {
        AmenityID: 0,
        SearchStr: "",
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let amenities = JSON.parse(res.data.JsonData);
            return amenities;
        });

    return useSWR(roomTypeAmenityUrl, fetcher);
};

export const AmenityAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),

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
            AmenityID: id,
        });

        return {
            data,
            status,
        };
    },
};
