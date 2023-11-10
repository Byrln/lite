import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Hotel";

export const AmenitySWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Amenity`, fetcher);
};

export const HotelAPI = {
    get: async () => {
        const res = await axios.get(`${urlPrefix}/Details`);

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

    hotelBe: async () => {
        const res = await axios.post(`${urlPrefix}/Be`);

        return res.data.JsonData;
    },

    beUpdate: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/BE/Update`,
            values
        );

        return {
            data,
            status,
        };
    },

    amenity: async () => {
        const res = await axios.get(`${urlPrefix}/Amenity`);

        return res.data.JsonData;
    },

    amenityInsertWUList: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Amenity/InsertWUList`,
            values
        );

        return {
            data,
            status,
        };
    },
};
