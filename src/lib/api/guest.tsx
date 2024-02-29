import useSWR from "swr";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Guest";
export const listUrl = `${urlPrefix}/List`;

export const GuestSWR = (search: any) => {
    const values = {
        GuestID: search.GuestID ? search.GuestID : 0,
        GuestName: search.GuestName ? search.GuestName : "",
        CountryID: search.CountryID ? search.CountryID : "0",
        IdentityValue: search.IdentityValue ? search.IdentityValue : "",
        Phone: search.Phone ? search.Phone : "",
        TransactionID: search.TransactionID ? search.TransactionID : "",
        IsMainOnly: search.IsMainOnly ? search.IsMainOnly : false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let roomTypes = res.data.JsonData;
            return roomTypes;
        });

    return useSWR(listUrl, fetcher);
};

export const GuestAPI = {
    list: async (values: any) => {
        let vals = values
            ? values
            : {
                  GuestID: 0,
                  GuestName: "",
                  CountryID: "0",
                  IdentityValue: "",
                  Phone: "",
                  TransactionID: "",
                  IsMainOnly: false,
              };

        const result: ApiResponseModel = await axios
            .post(listUrl, vals)
            .then(({ data, status }: any) => {
                var res: ApiResponseModel;
                if (status != 200) {
                    res = {
                        status: status,
                        msg: "",
                        data: null,
                    };
                    return res;
                }
                res = {
                    status: 200,
                    msg: "",
                    data: data.JsonData,
                };
                return res;
            });
        return result;
    },
    get: async (id: any) => {
        let vals = {
            GuestID: id,
            GuestName: "",
            CountryID: "0",
            IdentityValue: "",
            Phone: "",
            TransactionID: "",
            IsMainOnly: false,
        };

        const result: ApiResponseModel = await axios
            .post(listUrl, vals)
            .then(({ data, status }: any) => {
                var res: ApiResponseModel;
                if (status != 200) {
                    res = {
                        status: status,
                        msg: "",
                        data: null,
                    };
                    return res;
                }
                res = {
                    status: 200,
                    msg: "",
                    data: data.JsonData,
                };
                return res;
            });
        return result;
    },
    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

        return {
            data,
            status,
        };
    },

    update: async (id: any, values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Update`,
            values
        );
        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Delete`, {
            RoomTypeId: id,
        });

        return {
            data,
            status,
        };
    },
};
