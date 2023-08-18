import useSWR from "swr";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Reference/GuestTitle";
export const listUrl = `${urlPrefix}`;

export const GuestTitleSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => {
            let guestTitles = res.data.JsonData;
            return guestTitles;
        });
    return useSWR(listUrl, fetcher);
};

export const GuestTitleAPI = {};
