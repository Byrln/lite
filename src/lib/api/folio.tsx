import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Folio";
export const listUrl = `${urlPrefix}/Items`;

export const FolioItemSWR = (FolioID: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/Items`, { FolioID: FolioID })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Items`, fetcher);
};
export const FolioItemEditSWR = ({FolioID, CurrID}:any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/Items`, { FolioID:FolioID, CurrID:CurrID })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Items`, fetcher);
};

export const FolioSWR = (TransactionID: any, GroupID = null) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/Details`, {
                TransactionID: TransactionID,
                GroupID: GroupID,
            })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Details`, fetcher);
};

export const FolioByStatusSWR = (
    TransactionID: any,
    FolioID: any,
    Stay = null,
    Reservation = null,
    CheckedOut = null,
    EmptyRow = false
) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/DetailsByStatus`, {
                TransactionID: TransactionID,
                FolioID: FolioID,
                Stay: Stay,
                Reservation: Reservation,
                CheckedOut: CheckedOut,
                EmptyRow: EmptyRow,
            })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/DetailsByStatus`, fetcher);
};

export const GroupSummarySWR = (GroupID: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/Group/Summary`, { GroupID: GroupID })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Group/Summary`, fetcher);
};

export const GroupDetailSWR = (GroupID: any) => {
    const fetcher = async (url: any) =>
        await axios
            .post(`${urlPrefix}/Group/Detail`, { GroupID: GroupID })
            .then((res: any) => res.data.JsonData);

    return useSWR(`${urlPrefix}/Group/Detail`, fetcher);
};

export const FolioAPI = {
    get: async (id: any, additionalValues: any) => {
        console.log("id", id);
        let values = {
            FolioID: id[0],
            TypeID: id[1],
            CurrID: id[2],
        };

        values = Object.assign(values, additionalValues);

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    items: async (FolioID: any) => {
        const res = await axios.post(`${urlPrefix}/Items`, {
            FolioID: FolioID,
        });

        return res.data.JsonData;
    },
    edits: async (FolioID: any, CurrID:any, TypeID: any) => {
        const res = await axios.post(`${urlPrefix}/Items`, {
            FolioID: FolioID,
            CurrID: CurrID,
            TypeID: TypeID
        });

        return res.data.JsonData;
    },

    new: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/NewItem`,
            values
        );

        return {
            data,
            status,
        };
    },

    send: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/PostPendingCharge`,
            values
        );

        return {
            data,
            status,
        };
    },

    update: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/UpdateItem`,
            values
        );

        return {
            data,
            status,
        };
    },

    delete: async (id: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Delete`, {
            RoomChargeTypeID: id,
        });

        return {
            data,
            status,
        };
    },

    toggleChecked: async (
        id: any,
        checked: boolean,
        apiUrl: string,
        toggleKey: string
    ) => {
        const values = {
            RoomChargeTypeID: id,
            [toggleKey]: checked,
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

    cut: async (values: any) => {
        if (!values.CheckRC) {
            values.CheckRC = false;
        }

        if (!values.CheckEC) {
            values.CheckEC = false;
        }

        const { data, status } = await axios.post(`${urlPrefix}/Cut`, values);

        return {
            data,
            status,
        };
    },

    chargeToOwner: async (id: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Group/ChargeToOwner`,
            {
                GroupID: id,
            }
        );

        return {
            data,
            status,
        };
    },

    billTo: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/BillTo`,
            values
        );

        return {
            data,
            status,
        };
    },

    split: async (values: any) => {
        const { data, status } = await axios.post(`${urlPrefix}/Split`, values);

        return {
            data,
            status,
        };
    },
};
