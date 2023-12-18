import useSWR from "swr";
import axios from "lib/utils/axios";
import { fToUniversal } from "lib/utils/format-time";
import { date } from "yup/lib/locale";
import { SearchTwoTone } from "@mui/icons-material";

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

    return useSWR(listUrl, fetcher);
};

export const ReservationAPI = {
    get: async (id: any) => {
        console.log("id", id);
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
        vals.TransactionDetail.map((element: any) => {
            element.ArrivalDate = fToUniversal(element.ArrivalDate) + " 14:00";
            element.DepartureDate =
                fToUniversal(element.DepartureDate) + " 14:00";
        });

        // vals.ArrivalDate = fToUniversal(values.ArrivalDate) + " 14:00";
        // vals.DepartureDate = fToUniversal(values.DepartureDate) + " 14:00";

        const { data, status } = await axios.post(`${urlPrefix}/New`, vals);
        console.log("values", values);
        // return {
        //     status: status,
        //     code: data.Code,
        //     msg: data.Message,
        //     data: data.JsonData,
        // };
        return {
            status: values,
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
    roomMove: async (values: any) => {
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
