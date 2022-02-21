import useSWR from "swr";
import axios from "lib/utils/axios";

const urlPrefix = "/api/Reference/Country";
export const listUrl = `${urlPrefix}`;

export const CountrySWR = () => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => {
            let countries = JSON.parse(res.data.JsonData);
            return countries;
        });
    return useSWR(listUrl, fetcher);
};

export const CountryAPI = {};
