import useSWR from "swr";
import axios from "lib/utils/axios";
import { fToUniversal } from "lib/utils/format-time";

const urlPrefix = "/api/FrontOffice/TransactionInfo";
export const listUrl = `${urlPrefix}`;

export const TransactionSWR = (transactionID: any) => {
    const values = {
        TransactionID: transactionID,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let transaction = res.data.JsonData;
            return transaction[0] ? transaction[0] : transaction;
        });

    return useSWR(listUrl, fetcher);
};

export const TransactionAPI = {
    get: async (id: any) => {
        const values = {
            TransactionID: id,
        };
        const res = await axios.post(listUrl, values);

        var list = res.data.JsonData;
        var item;

        if (list.length === 1) {
            item = list[0];
        } else {
            item = null;
        }
        return item;
    },
};
