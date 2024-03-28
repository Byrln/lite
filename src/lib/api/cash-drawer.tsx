import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/CashDrawer";
export const listUrl = `${urlPrefix}/List`;

export const CashDrawerSWR = () => {
    const fetcher = async (url: any) =>
        await axios.post(url).then((res: any) => res.data.JsonData);

    return useSWR(`${listUrl}`, fetcher);
};

export const CashDrawerAPI = {
    get: async (id: any) => {
        const res = await axios.post(listUrl, { CashDrawerID: id });

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

    cut: async (values: any) => {
        if (!values.CheckRC) {
            values.CheckRC = false;
        }

        if (!values.CheckEC) {
            values.CheckEC = false;
        }

        const { data, status } = await axios.post(`${urlPrefix}/Cut`, values);

        return {
            data,
            status,
        };
    },

    chargeToOwner: async (id: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Group/ChargeToOwner`,
            {
                GroupID: id,
            }
        );

        return {
            data,
            status,
        };
    },

    billTo: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/BillTo`,
            values
        );

        return {
            data,
            status,
        };
    },

    split: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Split`, values);

        return {
            data,
            status,
        };
    },
};
