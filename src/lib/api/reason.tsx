import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Reason";
export const listUrl = `${urlPrefix}/List`;

export const ReasonSWR = (ReasonTypeID = 0) => {
    const values = {
        ReasonID: 0,
        ReasonTypeID: ReasonTypeID,
        EmptyRow: false,
    };

    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(listUrl, fetcher);
};

export const ReasonAPI = {
    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Delete`, {
            ReasonId: id,
        });

        return {
            data,
            status,
        };
    },
};
