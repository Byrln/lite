import useSWR from "swr";
import { useMemo } from "react";

import axios from "lib/utils/axios";

const urlPrefix = "/api/ChargeType";
export const listUrl = `${urlPrefix}/List`;

export const ChargeTypeSWR = (search: any) => {
    if (!search.RoomChargeTypeGroupID) {
        search.RoomChargeTypeGroupID = 0;
    }
    if (!search.RoomChargeTypeID) {
        search.RoomChargeTypeID = 0;
    }
    if (!search.IsExtraCharge) {
        search.IsExtraCharge = true;
    }
    if (!search.IsMiniBar) {
        search.StaIsMiniBartus = false;
    }
    if (!search.IsDiscount) {
        search.IsDiscount = null;
    }
    if (!search.IsInclusion) {
        search.IsInclusion = null;
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

export function useGetChargeTypeAPI(RoomChargeTypeID: any) {
    const fetcher = async (url: any) =>
        await axios
            .post(url, { RoomChargeTypeID: RoomChargeTypeID })
            .then((res: any) => res.data.JsonData);

    const { data, error, isValidating } = useSWR(`${listUrl}`, fetcher);
    const memoizedValue = useMemo(
        () => ({
            chargetype: data,

            chargetypeError: error,
            chargetypeValidating: isValidating,
        }),
        [data, error, isValidating]
    );
    return memoizedValue;
}

export const ChargeTypeAPI = {
    get: async (id: any, additionalValues: any) => {
        let values = {
            RoomChargeTypeID: id,
        };

        values = Object.assign(values, additionalValues);

        const res = await axios.post(listUrl, values);
        return res.data.JsonData;
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

    toggleChecked: async (
        id: any,
        checked: boolean,
        apiUrl: string,
        toggleKey: string
    ) => {
        const values = {
            RoomChargeTypeID: id,
            [toggleKey]: checked,
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
