import useSWR from "swr";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Reference/ReservationType";
export const listUrl = `${urlPrefix}`;

export const ReservationTypeSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => {
            let reservationTypes = JSON.parse(res.data.JsonData);
            return reservationTypes;
        });

    return useSWR(listUrl, fetcher);
};

export const ReservationTypeAPI = {};
