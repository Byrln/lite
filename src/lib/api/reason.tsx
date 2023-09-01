import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Reason";
export const listUrl = `${urlPrefix}/List`;

export const ReasonSWR = (search: any) => {
    if (!search.ReasonID) {
        search.ReasonID = 0;
    }

    if (!search.EmptyRow) {
        search.EmptyRow = false;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

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
