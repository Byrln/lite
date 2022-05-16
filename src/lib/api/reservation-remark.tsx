import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Remark/ReservationRemark";
export const listUrl = `${urlPrefix}`;

export const ReservationRemarkSWR = (TransactionID: any) => {
    const values = {
        TransactionID: TransactionID
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let list = JSON.parse(res.data.JsonData);
            return list;
        });

    return useSWR(listUrl, fetcher);
};

export const ReservationRemarkAPI = {
    new: async (values: any) => {
        const {data, status} = await axios.post(`${urlPrefix}New`, values);

        return {
            data,
            status,
        };
    },
    update: async (id: any, values: any) => {
        const {data, status} = await axios.put(`${urlPrefix}/${id}`, values);

        return {
            data,
            status,
        };
    },
    delete: async (id: any) => {
        const {data, status} = await axios.post(`${urlPrefix}/Delete`, {
            RateTypeID: id,
        });

        return {
            data,
            status,
        };
    },
};
