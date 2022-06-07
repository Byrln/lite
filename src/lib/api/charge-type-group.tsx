import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/ChargeTypeGroup";
export const listUrl = `${urlPrefix}/List`;

export const ChargeTypeGroupSWR = (listType: string) => {
    const values = {
        RoomChargeTypeGroupID: 0,
        SearchStr: "",
        IsRoomCharge: listType === "roomCharge" ? true : null,
        IsExtraCharge: listType === "extraCharge" ? true : null,
        IsMiniBar: listType === "miniBar" ? true : false,
        IsDiscount: listType === "discount" ? true : null,
        Status: null,
        EmptyRow: null,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};

export const ChargeTypeGroupAPI = {
    get: async (id: any, additionalValues: any) => {
        let values = {
            RoomChargeTypeGroupID: id,
        };

        values = Object.assign(values, additionalValues);

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
            RoomChargeTypeGroupID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            RoomChargeTypeGroupID: id,
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
