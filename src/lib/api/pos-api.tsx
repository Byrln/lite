import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Ebarimt/Pos";
export const listUrl = `${urlPrefix}/List`;
export const infoUrl = `${urlPrefix}/Info`;
export const checkUrl = `${urlPrefix}/Check`;
export const sendUrl = `${urlPrefix}/Send`;

export const PosApiSWR = () => {
    const fetcher = async (url: any) =>
        await axios
            .post(url)
            .then((res: any) =>
                res.data.JsonData.filter(
                    (item: any) =>
                        item.HotelID == localStorage.getItem("hotelId")
                )
            );

    return useSWR(listUrl, fetcher);
};

export const PosApiCheckSWR = (HotelCode: any) => {
    const values = { Code: HotelCode };
    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonString));

    return useSWR(checkUrl, fetcher);
};

export const PosApiInfoSWR = (HotelCode: any) => {
    const values = { Code: HotelCode };
    const fetcher = async (url: any) =>
        await axios
            .post(url, values)
            .then((res: any) => JSON.parse(res.data.JsonString));

    return useSWR(infoUrl, fetcher);
};

export const PosApiAPI = {
    info: async (id: any) => {
        const values = {
            Code: id,
        };

        const res = await axios.post(infoUrl, values);

        return JSON.parse(res.data.JsonString);
    },

    get: async (id: any) => {
        const values = {
            PosApiID: id,
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
            PosApiID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (id: any, checked: boolean, apiUrl: string) => {
        const values = {
            PosApiID: id,
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

    send: async (id: any) => {
        const values = {
            Code: id,
        };

        const res = await axios.post(sendUrl, values);

        return res.data.JsonData;
    },
};
