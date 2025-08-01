import useSWR from "swr";
import moment from "moment";

import axios from "lib/utils/axios";
import { dateStringToObj } from "lib/utils/helpers";

const urlPrefix = "/api/Season";
export const listUrl = `${urlPrefix}/List`;

export const SeasonSWR = (search: any) => {
    if (!search.SeasonID) {
        search.SeasonID = 0;
    }
    if (!search.Status) {
        search.Status = false;
    }
    if (!search.EmptyRow) {
        search.EmptyRow = false;
    }

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(listUrl, fetcher);
};

export const SeasonAPI = {
    get: async (id: any) => {
        const values = {
            SeasonID: id,
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
        values.BeginDate = moment(
            dateStringToObj(moment(values.BeginDate).format("YYYY-MM-DD")),
            "YYYY-MM-DD"
        );
        values.EndDate = moment(
            dateStringToObj(moment(values.EndDate).format("YYYY-MM-DD")),
            "YYYY-MM-DD"
        );
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
            SeasonID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            SeasonID: id,
            Status: checked,
        };

        const { data, status } = await axios.post(
            `${urlPrefix}/${apiUrl}`,
            values
        );

        return {
            data,
            status,
        };
    },
};
