import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Remark";
export const listUrl = `${urlPrefix}/GuestRemark`;

export const GuestRemarkSWR = (id: any) => {
    const values = {
        GuestID: id,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(`${listUrl}`, fetcher);
};

export const RemarkAPI = {
    get: async (id: any) => {
        const values = {
            GuestdatabaseID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(`${listUrl}New`, values);

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
            GuestdatabaseID: id,
        });

        return {
            data,
            status,
        };
    },
};
