import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/accounting/ExtraCharge";
export const extraChargeUrl = `${urlPrefix}/List`;

export const AccountingExtraChargeSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(extraChargeUrl, fetcher);
};

export const AccountingExtraChargeAPI = {
    get: async (id: any) => {
        const values = {
            RoomChargeTypeID: id,
        };

        const res = await axios.post(`${extraChargeUrl}`, values);

        return res.data.JsonData;
    },

    insertWU: async (values: any) => {
        const res = await axios.post(`${urlPrefix}/InsertWU`, values);

        return res.data.JsonData;
    },
};
