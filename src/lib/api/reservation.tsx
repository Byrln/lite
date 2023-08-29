import useSWR from "swr";
import axios from "lib/utils/axios";
import { fToUniversal } from "lib/utils/format-time";
import { date } from "yup/lib/locale";

const urlPrefix = "/api/Reservation";
export const listUrl = `${urlPrefix}/List`;

export const ReservationSWR = (values: any) => {
    // const values = {
    //     ReservationTypeID: ReservationTypeID,
    // };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const DepartureSWR = (values: any) => {
    // const values = {
    //     ReservationTypeID: ReservationTypeID,
    // };

    const fetcher = async (url: any) =>
        await axios
            .get(`${urlPrefix}/DepartureList`)
            .then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const DepartedListSWR = () => {
    // const values = {
    //     ReservationTypeID: ReservationTypeID,
    // };

    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/DepartedList`)
            .then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const GroupReservationSWR = () => {
    const values = {
        StartDate: date,
        EndDate: date,
    };
    // const values = {
    //     ReservationTypeID: ReservationTypeID,
    // };

    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/GroupList`, values)
            .then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const ReservationAPI = {
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
        // vals.ArrivalDate =
        //     fToUniversal(values.ArrivalDate) + " " + values.ArrivalTime;
        // vals.DepartureDate =
        //     fToUniversal(values.DepartureDate) + " " + values.DepartureTime;
        // vals.IsReserved = true;
        // vals.IsCheckIn = false;
        // vals.CustomerID = values.CustomerID > 0 ? values.CustomerID : 0;
        // vals.DurationEnabled = true;
        // vals.ReservationSourceID = 1;
        const { data, status } = await axios.post(`${urlPrefix}/New`, vals);

        return {
            status: status,
            code: data.Code,
            msg: data.Message,
            data: data.JsonData,
        };
    },
    checkIn: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/CheckIn`, values);
    },
    checkOut: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/CheckOut`, values);
    },
    amendStay: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/AmendStay`, values);
        console.log(res);
        return res;
    },
    cancel: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/Cancel`, values);
        return res;
    },
    noShow: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/NoShow`, values);
    },
    void: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/Void`, values);
        return res;
    },
    roomAssign: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/RoomAssign`, values);
    },
    roomUnassign: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/RoomUnassign`, values);
    },
    roomMove: async (TransactionID: any) => {
        const values = {
            TransactionID: TransactionID,
        };
        const res = await axios.post(`${urlPrefix}/RoomMove`, values);
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
};
