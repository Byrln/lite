import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/ChargeType";
export const listUrl = `${urlPrefix}/List`;

export const ChargeTypeSWR = (listType: any) => {
    const values = {
        RoomChargeTypeGroupID: 0,
        RoomChargeTypeID: 0,
        SearchStr: "",
        IsExtraCharge: listType == "extraCharge" ? true : null,
        IsMiniBar: listType == "miniBar" ? true : null,
        IsDiscount: listType == "discount" ? true : null,
        IsInclusion: listType == "inclusion" ? true : null,
        Status: null,
        EmptyRow: null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let extraCharges = JSON.parse(res.data.JsonData);
            return extraCharges;
        });

    return useSWR(listUrl, fetcher);
};

export const ChargeTypeAPI = {
    get: (id: any) => axios.get(`${urlPrefix}/${id}`),

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
            RoomChargeTypeID: id,
        });

        return {
            data,
            status,
        };
    },
};
