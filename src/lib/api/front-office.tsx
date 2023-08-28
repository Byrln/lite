import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/FrontOffice";
export const listUrl = `${urlPrefix}/ReservationDetailsByDate`;

export const FrontOfficeSWR = (date: any, dayCount: string = "30") => {
    const values = {
        CurrDate: date,
        NumberOfDays: parseInt(dayCount),
        RoomTypeID: 0,
    };

    const fetcher = async (url: any) =>
        await axios.post(url, values).then((res: any) => {
            let rates = res.data.JsonData;
            return rates;
        });

    return useSWR(listUrl, fetcher);
};

export const FrontOfficeAPI = {
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
