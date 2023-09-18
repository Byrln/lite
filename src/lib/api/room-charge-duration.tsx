import useSWR from "swr";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Reference/RoomChargeDuration";
export const listUrl = `${urlPrefix}`;

export const RoomChargeDurationSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => {
            let reservationChannels = res.data.JsonData;
            return reservationChannels;
        });

    return useSWR(listUrl, fetcher);
};

export const RoomChargeDurationAPI = {};
