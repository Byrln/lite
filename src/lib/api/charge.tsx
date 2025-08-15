import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Charge";
export const listUrl = `${urlPrefix}/List`;
export const listUrl2 = `${urlPrefix}/PendingRoomCharge`;

export const PendingRoomChargeSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(listUrl2).then((res: any) => res.data.JsonData);

    return useSWR(listUrl2, fetcher);
};

export const ChargeSummarySWR = (TransactionID: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/Summary`, { TransactionID: TransactionID })
            .then((res: any) => res.data.JsonData);

    return useSWR([`${urlPrefix}/Summary`, TransactionID], fetcher);
};

export const RoomChargeSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/RoomCharge`, search)
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/RoomCharge`, fetcher);
};

export const ChargeAPI = {
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

    send: async (values: any) => {
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

    updateRateType: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/UpdateRateType`,
            values
        );

        return {
            data,
            status,
        };
    },

    UpdatePax: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/UpdatePax`,
            values
        );

        return {
            data,
            status,
        };
    },

    UpdateRate: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/UpdateRate`,
            values
        );

        return {
            data,
            status,
        };
    },

    summary: async (TransactionID: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Summary`, {
            TransactionID: TransactionID,
        });

        return {
            data,
            status,
        };
    },
};
