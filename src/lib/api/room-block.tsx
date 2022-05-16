import useSWR from "swr";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/RoomBlock";
export const listUrl = `${urlPrefix}/List`;

export const RoomBlockSWR = (dateStart: any, dateEnd: any) => {
    const values = {
        RoomBlockID: 0,
        StartDate: dateStart,
        EndDate: dateEnd,
        RoomID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let list = JSON.parse(res.data.JsonData);
            return list;
        });

    return useSWR(listUrl, fetcher);
};

export const RoomBlockAPI = {
    list: async (values: any) => {
        const { data, status } = await axios.post(
            listUrl,
            values
        );
        if (status != 200) {
            return [];
        }
        var list = JSON.parse(data.JsonData);
        return list;
    },
    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

        return {
            data,
            status,
        };
    },

    updateStatus: async (id: any, values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/UpdateStatus`, values);
        return {
            data,
            status,
        };
    },

    update: async (id: any, values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Update`, values);

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
