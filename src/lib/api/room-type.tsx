import useSWR from "swr";

import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/RoomType";
export const listUrl = `${urlPrefix}/List`;

export const RoomTypeSWR = (search: any) => {
    if (!search.RoomTypeID) {
        search.RoomTypeID = 0;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const RoomTypeAvailableSWR = (search: any) => {
    if (!search.RoomTypeID) {
        search.RoomTypeID = 0;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Available`, fetcher);
};

export const RoomTypeAPI = {
    // list: async (values: any) => {
    //     const res = await axios.post(listUrl, values);

    //     return res.data.JsonData;
    // },

    get: async (id: any) => {
        const values = {
            RoomTypeID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    amenity: async (id: any) => {
        const values = {
            RoomTypeID: id,
        };

        const res = await axios.post(`${urlPrefix}/Amenity`, values);

        return res.data.JsonData;
    },

    list: async (values: any) => {
        const { data, status } = await axios.post(listUrl, values);
        if (status != 200) {
            return [];
        }
        var list = data.JsonData;
        return list;
    },

    list2: async (values: any) => {
        let vals = values
            ? values
            : {
                  RoomTypeID: 0,
                  SearchStr: "",
                  EmptyRow: "0",
              };

        const result: ApiResponseModel = await axios
            .post(listUrl, vals)
            .then(({ data, status }: any) => {
                var res: ApiResponseModel;
                if (status != 200) {
                    res = {
                        status: status,
                        msg: "",
                        data: null,
                    };
                    return res;
                }
                res = {
                    status: 200,
                    msg: "",
                    data: data.JsonData,
                };
                return res;
            });
        return result;
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
            RoomTypeId: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            RoomTypeID: id,
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

    amenityInsertWU: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/AmenityInsertWU`,
            values
        );

        return {
            data,
            status,
        };
    },

    amenityInsertWUList: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/AmenityInsertWUList`,
            values
        );

        return {
            data,
            status,
        };
    },

    listAvailable: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Available`,
            values
        );

        if (status !== 200) {
            return [];
        }

        return data.JsonData;
    },
};
