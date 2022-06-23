import useSWR from "swr";
import axios from "lib/utils/axios";
import { date } from "yup/lib/locale";

const urlPrefix = "/api/RoomBlock";
export const listUrl = `${urlPrefix}/List`;

export const RoomBlockSWR = () => {
    const values = {
        RoomBlockID: 0,
        StartDate: date,
        EndDate: date,
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
        const { data, status } = await axios.post(listUrl, values);
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
        const { data, status } = await axios.post(
            `${urlPrefix}/UpdateStatus`,
            values
        );
        return {
            data,
            status,
        };
    },

    update: async (id: any, values: any) => {
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
};
