import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/EmailConfiguration";
export const listUrl = `${urlPrefix}/List`;

export const EmailSWR = () => {
    const values = {
        EmailID: 0,
        IsMain: null,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let emails = JSON.parse(res.data.JsonData);
            return emails;
        });

    return useSWR(listUrl, fetcher);
};

export const EmailAPI = {
    new: async (values: any) => {
        const { data, status } = await axios.post(urlPrefix, values);

        return {
            data,
            status,
        };
    },
};
