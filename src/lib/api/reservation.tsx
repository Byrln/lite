import useSWR from "swr";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Reservation";
export const listUrl = `${urlPrefix}/List`;

export const ReservationApi = {
    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);
        return {
            data,
            status,
        };
    },
};
