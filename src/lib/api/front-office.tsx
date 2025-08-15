import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/FrontOffice";
export const listUrl = `${urlPrefix}/ReservationDetailsByDate`;

export const FrontOfficeSWR = (search: any) => {
    // const values = {
    //     CurrDate: date,
    //     NumberOfDays: parseInt(dayCount),
    //     RoomTypeID: 0,
    // };

    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => {
            let rates = res.data.JsonData;
            return rates;
        });

    return useSWR(listUrl, fetcher);
};

export const WorkingDateSWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => {
            let workingDate = res.data.JsonData;
            return workingDate;
        });

    return useSWR(`${urlPrefix}/WorkingDate`, fetcher);
};

export const TransactionInfoSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => {
            let rates = res.data.JsonData;
            return rates;
        });

    return useSWR(`${urlPrefix}/TransactionInfo`, fetcher);
};

export const FrontOfficeAPI = {
    list: async (search: any) => {
        const res = await axios.post(listUrl, search);
        var list = res.data.JsonData;

        return list;
    },

    transactionInfoList: async (search: any) => {
        const res = await axios.post(`${urlPrefix}/TransactionInfo`, search);
        var list = res.data.JsonData;

        return list;
    },

    transactionInfo: async (id: any) => {
        const values = {
            TransactionID: id,
        };
        const res = await axios.post(`${urlPrefix}/TransactionInfo`, values);
        var list = res.data.JsonData;
        var item;
        if (list.length === 1) {
            item = list[0];
        } else {
            item = null;
        }
        return item;
    },

    workingDate: async () => {
        const { data, status } = await axios.get(`${urlPrefix}/WorkingDate`);
        let workingDate = data.JsonData;
        return {
            workingDate,
            status,
        };
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(urlPrefix, values);

        return {
            data,
            status,
        };
    },

    update: async (id: any, values: any) => {
        const { data, status } = await axios.put(`${urlPrefix}/${id}`, values);

        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Delete`, {
            RoomId: id,
        });

        return {
            data,
            status,
        };
    },
};
