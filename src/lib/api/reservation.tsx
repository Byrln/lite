import useSWR from "swr";
import axios from "lib/utils/axios";

export const urlPrefix = "/api/Reservation";
export const listUrl = `${urlPrefix}/List`;

export const ReservationSWR = (search: any) => {
    if (!search.ReservationTypeID) {
        search.ReservationTypeID = 1;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const ReservationGroupRoomTypeSWR = (id: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(url, { GroupID: id })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Group/RoomTypes`, fetcher);
};

export const ReservationGroupRoomSWR = (id: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(url, { GroupID: id })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Group/Rooms`, fetcher);
};

export const ReservationLogSWR = (id: any, groupID: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(url, { TransactionID: id, GroupID: groupID })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Log`, fetcher);
};

export const DepartureSWR = (values: any) => {
    const fetcher = async (url: any) =>
        await axios
            .get(`${urlPrefix}/DepartureList`)
            .then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const DepartedListSWR = () => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/DepartedList`)
            .then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const GroupReservationSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/GroupList`, search)
            .then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const PendingReservationSWR = () => {
    const fetcher = async () =>
        await axios
            .get(`${urlPrefix}/PendingReservation`)
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/PendingReservation`, fetcher);
};

export const PendingDueOutSWR = () => {
    const fetcher = async (url: any) =>
        await axios
            .get(`${urlPrefix}/PendingDueOut`)
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/PendingDueOut`, fetcher);
};

export const SharerListSWR = (TransactionID: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/Sharer/List`, { TransactionID: TransactionID })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Sharer/List`, fetcher);
};

export const ReservationAPI = {
    groupReservation: async (search: any) => {
        const res = await axios.post(`${urlPrefix}/GroupList`, search);
        var list = res.data.JsonData;

        return list;
    },

    get: async (id: any) => {
        const values = {
            CustomerID: 0,
            ReservationTypeID: 0,
            ReservationSourceID: 0,
            TransactionIDs: [
                {
                    ID: id,
                },
            ],
        };
        const res = await axios.post(listUrl, values);
        var list = res.data.JsonData;
        var item;

        if (list.length === 1) {
            item = list[0];
        } else {
            item = null;
        }
        return item;
    },

    new: async (values: any) => {
        var vals = values;

        const { data, status } = await axios.post(`${urlPrefix}/New`, vals);
        return {
            status: values,
        };
    },
    checkIn: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/CheckIn`, values);
        return res;
    },
    checkOut: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/CheckOut`, values);
        return res;
    },
    amendStay: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/AmendStay`, values);
        return res;
    },
    groupAmendStay: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/GroupAmendStay`, values);
        return res;
    },
    cancel: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/Cancel`, values);
        return res;
    },
    noShow: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/NoShow`, values);
        return res;
    },
    void: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/Void`, values);
        return res;
    },
    roomAssign: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/RoomAssign`, values);
        return res;
    },
    roomUnassign: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/RoomUnassign`, values);
        return res;
    },
    roomMove: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/RoomMove`, values);
        return res;
    },
    updateReservationType: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(
            `${urlPrefix}/UpdateReservationType`,
            values
        );
    },

    groupList: async (id: any) => {
        const values = {
            GroupID: id,
        };
        const res = await axios.post(`${urlPrefix}/GroupList`, values);

        var list = res.data.JsonData;
        var item;

        if (list.length === 1) {
            item = list[0];
        } else {
            item = null;
        }
        return item;
    },

    guestReplace: async (values: any) => {
        var vals = values;

        const { data, status } = await axios.post(
            `${urlPrefix}/UpdateGuest`,
            values
        );
        return {
            status: values,
        };
    },

    customerReplace: async (values: any) => {
        var vals = values;

        const { data, status } = await axios.post(
            `${urlPrefix}/UpdateCustomer`,
            values
        );
        return {
            status: values,
        };
    },
};
