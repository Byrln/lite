import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Amenity";
export const listUrl = `${urlPrefix}/List`;
export const roomTypeAmenityUrl = `${urlPrefix}/RoomTypeAmenity`;

export const AmenitySWR = (search: any) => {
    if (!search.AmenityID) {
        search.AmenityID = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const RoomTypeAmenitySWR = () => {
    const values = {
        AmenityID: 0,
        SearchStr: "",
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(roomTypeAmenityUrl, fetcher);
};

export const AmenityAPI = {
    get: async (id: any) => {
        const values = {
            AmenityID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

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
            AmenityID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            AmenityID: id,
            Status: checked,
        };

        const { data, status } = await axios.post(
            `${urlPrefix}/${apiUrl}`,
            values
        );

        return {
            data,
            status,
        };
    },
};
