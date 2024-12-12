import axios from "../utils/axios";
import useSWR from "swr";

const uri = "/api/FrontOffice/StayView2";

export const StayView2SWR = (date: any, dayCount: any = "30") => {
    const values = {
        CurrDate: date,
        NumberOfDays: parseInt(dayCount),
        RoomTypeID: 0,
        IncludeRoomBlock: true,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let rates = res.data.JsonData;
            return rates;
        });

    return useSWR(uri, fetcher);
};
export default StayView2SWR;

export const StayView2API = {
    list: async (date: any, dayCount: any = "30") => {
        const values = {
            CurrDate: date,
            NumberOfDays: parseInt(dayCount),
            RoomTypeID: 0,
            IncludeRoomBlock: true,
        };

        const { data, status } = await axios.post(uri, values);
        if (status != 200) {
            return [];
        }
        var list = data.JsonData;
        return list;
    },
};
