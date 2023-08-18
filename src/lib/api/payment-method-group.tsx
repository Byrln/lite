import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/PaymentMethodGroup";
export const listUrl = `${urlPrefix}/List`;

export const PaymentMethodGroupSWR = () => {
    const values = {
        PaymentMethodGroupID: 0,
        SearchStr: "",
        IsCustomerRelated: false,
        Status: false,
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let paymentMethodGroup = res.data.JsonData;
            return paymentMethodGroup;
        });

    return useSWR(listUrl, fetcher);
};

export const PaymentMethodGroupAPI = {
    new: async (values: any) => {
        const { data, status } = await axios.post(urlPrefix, values);

        return {
            data,
            status,
        };
    },
};
