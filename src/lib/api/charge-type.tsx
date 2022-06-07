import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/ChargeType";
export const listUrl = `${urlPrefix}/List`;

export const ChargeTypeSWR = (listType: string) => {
    const values = {
        RoomChargeTypeGroupID: 0,
        RoomChargeTypeID: 0,
        SearchStr: "",
        IsExtraCharge: listType === "extraCharge" ? true : null,
        IsMiniBar: listType === "miniBar" ? true : null,
        IsDiscount: listType === "discount" ? true : null,
        IsInclusion: listType === "inclusion" ? true : null,
        Status: null,
        EmptyRow: null,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};

export const ChargeTypeAPI = {
    get: async (id: any, additionalValues: any) => {
        let values = {
            RoomChargeTypeID: id,
        };

        values = Object.assign(values, additionalValues);

        const res = await axios.post(listUrl, values);

        return JSON.parse(res.data.JsonData);
    },

    new: async (values: any) => {
        values = Object.assign(values, { Status: true });

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
            RoomChargeTypeID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            RoomChargeTypeID: id,
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
