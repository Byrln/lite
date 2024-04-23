import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/WorkOrder";
export const listUrl = `${urlPrefix}/list`;

export const WorkOrderSWR = (search: any) => {
    if (!search.WorkOrderRegisterID) {
        search.WorkOrderRegisterID = null;
    }
    if (!search.AssignedUserID) {
        search.AssignedUserID = null;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = 0;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const WorkOrderAPI = {
    get: async (id: any) => {
        const values = {
            WorkOrderRegisterID: id,
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
        const { data, status } = await axios.post(`${urlPrefix}/Cancel`, {
            WorkOrderRegisterID: id,
        });

        return {
            data,
            status,
        };
    },
};
