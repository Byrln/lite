import useSWR from "swr";

import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Room";
export const listUrl = `${urlPrefix}/List`;

export const RoomSWR = () => {
    const values = {
        RoomID: 0,
        RoomTypeID: 0,
        FloorID: 0,
        SearchStr: "",
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let rooms = JSON.parse(res.data.JsonData);
            return rooms;
        });

    return useSWR(listUrl, fetcher);
};

export const RoomAPI = {
    list: async (values: any) => {
        const vals = values
            ? values
            : {
                  RoomID: 0,
                  RoomTypeID: 0,
                  FloorID: 0,
                  SearchStr: "",
                  EmptyRow: false,
              };

        const result: ApiResponseModel = await axios
            .post(listUrl, vals)
            .then(({ data, status }: any) => {
                let res: ApiResponseModel;

                if (status !== 200) {
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
                    data: JSON.parse(data.JsonData),
                };

                return res;
            });

        return result;
    },

    listAvailable: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Available`,
            values
        );

        if (status !== 200) {
            return [];
        }

        return JSON.parse(data.JsonData);
    },

    get: async (id: any) => {
        const values = {
            RoomID: id,
        };

        const res = await axios.post(listUrl, values);

        return JSON.parse(res.data.JsonData);
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
            RoomId: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            RoomID: id,
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
