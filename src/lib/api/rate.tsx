import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Rate";
export const listUrl = `${urlPrefix}/List`;

export const RateSWR = () => {
    const values = {
        RoomTypeID: 0,
        RateTypeID: 0,
        ChannelID: 0,
        SourceID: 0,
        SeasonID: 0,
        CustomerID: 0,
        TaxIncluded: false,
        RoomChargeDuration: 1,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let rates = JSON.parse(res.data.JsonData);
            return rates;
        });

    return useSWR(listUrl, fetcher);
};

export const RateAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),

    new: async (values: any) => {
        const { data, status } = await axios.post(urlPrefix, values);

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
            RoomId: id,
        });

        return {
            data,
            status,
        };
    },
};
