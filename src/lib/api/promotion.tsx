import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Promotion";
export const listUrl = `${urlPrefix}/List`;

export const PromotionSWR = (search: any) => {
    if (!search.PromotionID) {
        search.PromotionID = null;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const PromotionAPI = {
    get: async (id: any) => {
        const values = {
            PromotionID: id,
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
            PromotionID: id,
        });

        return {
            data,
            status,
        };
    },
};
