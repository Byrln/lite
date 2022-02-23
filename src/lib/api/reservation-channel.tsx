import useSWR from "swr";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Reference/ReservationChannel";
export const listUrl = `${urlPrefix}`;

export const ReservationChannelSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => {
            let reservationChannels = JSON.parse(res.data.JsonData);
            return reservationChannels;
        });

    return useSWR(listUrl, fetcher);
};

export const ReservationChannelAPI = {};
