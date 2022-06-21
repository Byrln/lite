import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/PromotionType";
export const listUrl = `${urlPrefix}/List`;

export const PromotionTypeSWR = () => {
    const values = {
        PromotionTypeID: null,
        EmptyRow: 0,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};
