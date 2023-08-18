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
        await axios.post(url, values).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const EmailAPI = {
    get: async (id: any) => {
        const values = {
            EmailID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/New`, values);

        return {
            data,
            status,
        };
    },

    update: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Update`,
            values
        );

        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Delete`, {
            EmailID: id,
        });

        return {
            data,
            status,
        };
    },

    changePassword: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/ChangePassword`,
            values
        );

        return {
            data,
            status,
        };
    },
};
