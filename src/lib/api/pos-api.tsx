import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Ebarimt3/Pos";
export const listUrl = `${urlPrefix}/List`;
export const infoUrl = `${urlPrefix}/Info`;
export const checkUrl = `${urlPrefix}/Check`;
export const sendUrl = `${urlPrefix}/Send`;
export const districtUrl = `/api/Ebarimt3/District/List`;
export const itemCodeUrl = `/api/Ebarimt3/ItemCode/List`;
export const customerNameUrl = `/api/Ebarimt3/CustomerName`;
export const printUrl = `/api/Ebarimt3/Print`;

export const PosApiSWR = () => {
    const fetcher = async (url: any) =>
        await axios
            .post(url)
            .then((res: any) =>
                res.data.JsonData.filter(
                    (item: any) =>
                        item.HotelCode ==
                        String(localStorage.getItem("hotelId"))
                )
            );

    return useSWR(listUrl, fetcher);
};

export const ItemCodeSWR = (search: any) => {
    const fetcher = async (url: any) =>
        await axios.post(url, search).then((res: any) => res.data.JsonData);

    return useSWR(itemCodeUrl, fetcher);
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

export const PosApiDistrictListSWR = () => {
    const fetcher = async (url: any) =>
        await axios.post(url).then((res: any) => res.data.JsonData);

    return useSWR(districtUrl, fetcher);
};

export const PosApiAPI = {
    district: async (id: any) => {
        const values = {
            Code: id,
        };

        const res = await axios.post(districtUrl, values);
        return JSON.parse(res.data.JsonString);
    },

    info: async (id: any) => {
        const values = {
            Code: id,
        };

        const res = await axios.post(infoUrl, values);

        return JSON.parse(res.data.JsonString);
    },

    itemCode: async () => {
        const res = await axios.post(itemCodeUrl);

        return res.data.JsonData;
    },

    get: async (id: any) => {
        const values = {
            PosApiID: id,
        };

        const res = await axios.post(listUrl, values);

        return res.data.JsonData;
    },

    new: async (values: any) => {
        let tempValues = {
            PosApiID: values.PosApiID,
            BranchNo: values.BranchNo,
            DistrictCode: values.DistrictCode,
            SubDistrictCode: values.SubDistrictCode,
        };
        const { data, status } = await axios.post(
            `${urlPrefix}/Update`,
            tempValues
        );

        return {
            data,
            status,
        };
    },

    update: async (values: any) => {
        let tempValues = {
            PosApiID: values.PosApiID,
            BranchNo: values.BranchNo,
            DistrictCode: values.DistrictCode,
            SubDistrictCode: values.SubDistrictCode,
        };
        const { data, status } = await axios.post(
            `${urlPrefix}/Update`,
            tempValues
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

    customerName: async (CompanyID: any) => {
        const values = {
            CompanyID: CompanyID,
        };

        const res = await axios.post(customerNameUrl, values);

        return JSON.parse(res.data.JsonString);
    },

    print: async (values: any) => {
        const res = await axios.post(printUrl, values);

        return res.data;
    },
};
