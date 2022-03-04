import useSWR from "swr";
import axios from "lib/utils/axios";
import { fToUniversal } from "lib/utils/format-time";

const urlPrefix = "/api/Reservation";
export const listUrl = `${urlPrefix}/List`;

export const ReservationApi = {
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

        console.log(res);

        var list = JSON.parse(res.data.JsonData);
        var item;

        console.log(list);

        if (list.length === 1) {
            item = list[0];
        } else {
            item = null;
        }
        return item;
    },

    new: async (values: any) => {
        var vals = values;
        vals.ArrivalDate =
            fToUniversal(values.ArrivalDate) + " " + values.ArrivalTime;
        vals.DepartureDate =
            fToUniversal(values.DepartureDate) + " " + values.DepartureTime;
        vals.RateModeID = 1;
        vals.IsReserved = true;
        vals.IsCheckIn = false;
        vals.CustomerID = values.CustomerID > 0 ? values.CustomerID : 0;
        vals.IsGroup = false;
        vals.DurationEnabled = true;
        vals.ReservationSourceID = 1;

        const { data, status } = await axios.post(`${urlPrefix}/New`, vals);
        return {
            data,
            status,
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
