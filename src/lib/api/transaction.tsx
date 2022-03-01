import useSWR from "swr";
import axios from "lib/utils/axios";
import { fToUniversal } from "lib/utils/format-time";

const urlPrefix = "/api/FrontOffice/TransactionInfo";
export const listUrl = `${urlPrefix}`;

export const TransactionAPI = {
    get: async (id: any) => {
        const values = {
            TransactionID: id,
        };
        const res = await axios.post(listUrl, values);

        console.log(res);

        var list = JSON.parse(res.data.JsonData);
        var item;

        console.log(list);

        if (list.length === 1) {
            item = list[0];
        } else {
            item = null;
        }
        return item;
    },
};
