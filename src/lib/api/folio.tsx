import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Folio";
export const listUrl = `${urlPrefix}/Items`;

export const FolioItemSWR = (FolioID: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/Items`, { FolioID: FolioID })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Items`, fetcher);
};

export const FolioAPI = {
    get: async (id: any, additionalValues: any) => {
        let values = {
            RoomChargeTypeID: id,
        };

        values = Object.assign(values, additionalValues);

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/NewItem`,
            values
        );

        return {
            data,
            status,
        };
    },

    send: async (values: any) => {
        console.log("valuestest", values);
        const { data, status } = await axios.post(
            `${urlPrefix}/PostPendingCharge`,
            values
        );

        return {
            data,
            status,
        };
    },

    update: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/UpdateItem`,
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
