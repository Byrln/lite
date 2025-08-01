import useSWR from "swr";
import { useMemo } from "react";

import axios from "lib/utils/axios";

const urlPrefix = "/api/ChargeTypeGroup";
export const listUrl = `${urlPrefix}/List`;

export const ChargeTypeGroupSWR = (search: any) => {
    console.log("search", search);
    if (!search.RoomChargeTypeGroupID) {
        search.RoomChargeTypeGroupID = 0;
    }
    if (!search.IsRoomCharge) {
        search.IsRoomCharge = false;
    }
    if (!search.IsExtraCharge) {
        search.IsExtraCharge = true;
    }
    if (!search.IsMiniBar) {
        search.IsMiniBar = false;
    }
    if (!search.IsDiscount) {
        search.IsDiscount = false;
    }
    if (!search.Status) {
        search.Status = null;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = null;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export function useGetChargeTypeGroupAPI() {
    const fetcher = async (url: any) =>
        await axios.post(url).then((res: any) => res.data.JsonData);

    const { data, error, isValidating } = useSWR(`${listUrl}`, fetcher);
    const memoizedValue = useMemo(
        () => ({
            chargegroup: data,

            chargegroupError: error,
            chargegroupValidating: isValidating,
        }),
        [data, error, isValidating]
    );
    return memoizedValue;
}

export const ChargeTypeGroupAPI = {
    list: async () => {
        const res = await axios.post(listUrl);

        return res.data.JsonData;
    },
    get: async (id: any, additionalValues: any) => {
        let values = {
            RoomChargeTypeGroupID: id,
        };

        values = Object.assign(values, additionalValues);

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
