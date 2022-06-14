import useSWR from "swr";

import axios from "lib/utils/axios";

const urlPrefix = "/api/Reference";

export const ReferenceSWR = (type: string) => {
    const fetcher = async (url: any) =>
        await axios.get(url).then((res: any) => JSON.parse(res.data.JsonData));

    return useSWR(`${urlPrefix}/${type}`, fetcher);
};
