import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/ReservationSource";
export const listUrl = `${urlPrefix}/list`;

export const ReservationSourceSWR = (search: any) => {
    if (!search.ReservationSourceID) {
        search.ReservationSourceID = null;
    }
    if (!search.ChannelId) {
        search.ChannelId = null;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const BeLink = (search: any) => {
    if (!search.ChannelSourceID) {
        search.ChannelSourceID = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);
    return useSWR(`${urlPrefix}/BE/Link`, fetcher);
};

export const ReservationStatusSWR = (search: any) => {
    if (!search.ChannelSourceID) {
        search.ChannelSourceID = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);
    return useSWR(`${urlPrefix}/ReservationStatus`, fetcher);
};

export const BookingSourceSWR = () => {
    const fetcher = async (url: any) =>
        await axios.post(url, {}).then((res: any) => res.data.JsonData);
    return useSWR(`${urlPrefix}/BE/BookingSource`, fetcher);
};

export const ReservationSourceAPI = {
    list: async (values: any) => {
        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    get: async (id: any) => {
        const values = {
            ReservationSourceID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        if (values.ChannelID == 1) {
            values.ChannelSourceID = null;
        }

        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

        return {
            data,
            status,
        };
    },

    update: async (values: any) => {
        if (values.ChannelID == 1) {
            values.ChannelSourceID = null;
        }

        const { data, status } = await axios.post(
            `${urlPrefix}/Update`,
            values
        );

        return {
            data,
            status,
        };
    },

    reservationStatus: async (ChannelSourceID: any, entity: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/ReservationStatus/InsertWU`,
            {
                ChannelSourceID: ChannelSourceID,
                CustomerID: 0,
                DefaultStatusID: entity.DefaultStatusID,
                PaidStatusID: entity.PaidStatusID,
                AutoAssignRoom: entity.AutoAssignRoom,
            }
        );

        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Delete`, {
            ReservationSourceID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            ReservationSourceID: id,
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
