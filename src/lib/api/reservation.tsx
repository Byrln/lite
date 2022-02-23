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
        vals.ReservationTypeID = 1;
        vals.RateModeID = 1;
        vals.IsReserved = true;
        vals.IsCheckIn = false;
        vals.CustomerID = values.CustomerID > 0 ? values.CustomerID : 0;
        vals.IsGroup = false;
        vals.DurationEnabled = true;

        const { data, status } = await axios.post(`${urlPrefix}/New`, vals);
        return {
            data,
            status,
        };
    },
};
