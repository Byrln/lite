import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/ChargeTypeGroup";
export const listUrl = `${urlPrefix}/List`;

export const ChargeTypeGroupSWR = (search: any) => {
    if (!search.RoomChargeTypeGroupID) {
        search.RoomChargeTypeGroupID = 0;
    }
    if (!search.IsRoomCharge) {
        search.IsRoomCharge = null;
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

export const ChargeTypeGroupAPI = {
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
