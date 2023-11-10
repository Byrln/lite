import useSWR from "swr";

import axios from "lib/utils/axios";
const urlPrefix = "/api/Picture";
export const listUrl = `${urlPrefix}/Details`;

export const PictureSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Details`, fetcher);
};

export const PictureAPI = {
    get: async (search: any) => {
        const res = await axios.post(`${urlPrefix}/Details`, search);

        return res.data.JsonData;
    },

    upload: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Upload`,
            values,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return {
            data,
            status,
        };
    },
};
