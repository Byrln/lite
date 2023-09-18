import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Rate";
export const listUrl = `${urlPrefix}/List`;

export const RateSWR = (search: any) => {
    if (!search.RoomTypeID) {
        search.RoomTypeID = 0;
    }
    if (!search.RateTypeID) {
        search.RateTypeID = 0;
    }
    if (!search.ChannelID) {
        search.ChannelID = 0;
    }
    if (!search.SourceID) {
        search.SourceID = 0;
    }
    if (!search.SeasonID) {
        search.SeasonID = 0;
    }
    if (!search.CustomerID) {
        search.CustomerID = 0;
    }
    if (!search.TaxIncluded) {
        search.TaxIncluded = 0;
    }
    if (!search.RoomChargeDuration) {
        search.RoomChargeDuration = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => {
            let rates = res.data.JsonData;
            return rates;
        });

    return useSWR(listUrl, fetcher);
};

export const RateAPI = {
    list: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/List`, values);
        if (status != 200) {
            return [];
        }
        var list = data.JsonData;
        return list;
    },
    listByDate: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/ListByDate`,
            values
        );
        if (status != 200) {
            return [];
        }
        var list = data.JsonData;
        return list;
    },
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),
    new: async (values: any) => {
        const { data, status } = await axios.post(urlPrefix, values);

        return {
            data,
            status,
        };
    },

    insertWUList: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/InsertWUList`,
            values
        );

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
