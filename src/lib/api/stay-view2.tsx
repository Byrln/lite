import axios from "../utils/axios";
import useSWR from "swr";
import {listUrl} from "./room";

const uri = "/api/FrontOffice/StayView2";

export const StayView2SWR = (date: any, dayCount: string = "30") => {
    const values = {
        CurrDate: date,
        NumberOfDays: parseInt(dayCount),
        RoomTypeID: 0,
        IncludeRoomBlock: true
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            // let rates = JSON.parse(res.data.JsonData);
            let rates = res.data.JsonData;
            return rates;
        });

    return useSWR(uri, fetcher);
};
export default StayView2SWR;
