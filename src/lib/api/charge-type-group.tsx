import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/ChargeTypeGroup";
export const listUrl = `${urlPrefix}/List`;

export const ChargeTypeGroupSWR = (listType: any) => {
    const values = {
        RoomChargeTypeGroupID: 0,
        SearchStr: "",
        IsRoomCharge: listType == "roomCharge" ? true : null,
        IsExtraCharge: listType == "extraCharge" ? true : null,
        IsMiniBar: listType == "miniBar" ? true : null,
        IsDiscount: listType == "discount" ? true : null,
        Status: null,
        EmptyRow: null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let chargeTypeGroups = JSON.parse(res.data.JsonData);
            return chargeTypeGroups;
        });

    return useSWR(listUrl, fetcher);
};

export const ChargeTypeGroupAPI = {
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
            RoomChargeTypeGroupID: id,
        });

        return {
            data,
            status,
        };
    },
};
