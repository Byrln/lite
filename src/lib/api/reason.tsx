import useSWR from "swr";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Reason";
export const listUrl = `${urlPrefix}/List`;

export const ReasonSWR = () => {
    const values = {
        ReasonID: 0,
        ReasonTypeID: 0,
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let list = JSON.parse(res.data.JsonData);
            return list;
        });

    return useSWR(listUrl, fetcher);
};

export const ReasonAPI = {
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

    update: async (id: any, values: any) => {
        const { data, status } = await axios.put(`${urlPrefix}/${id}`, values);

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
