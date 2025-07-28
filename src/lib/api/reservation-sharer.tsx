import useSWR from "swr";
import axios from "lib/utils/axios";
export const urlPrefix = "/api/Reservation/Sharer";
export const listUrl = `${urlPrefix}/List`;

export const SharerListSWR = (TransactionID: any) => {
  const fetcher = async (url: any) =>
    await axios
      .post(`${listUrl}`, { TransactionID: TransactionID })
      .then((res: any) => res.data.JsonData);

  return useSWR(`${listUrl}/${TransactionID}`, fetcher);
};

export const SharerListAPI = {
  get: async (id: any) => {
    const values = {
      TransactionID: id,
    };
    const res = await axios.post(listUrl, values);
    var list = res.data.JsonData;
    var item;

    if (list.length === 1) {
      item = list[0];
    } else {
      item = null;
    }
    return item;
  },

  new: async (values: any) => {
    var vals = values;

    const { data, status } = await axios.post(`${urlPrefix}/Add`, vals);
    return {
      status: values,
    };
  },

  delete: async (values: any) => {
    const res = await axios.post(`${urlPrefix}/Delete`, values);
    return res;
  },
};
