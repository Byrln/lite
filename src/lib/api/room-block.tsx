import useSWR from "swr";
import axios from "lib/utils/axios";
import { date } from "yup/lib/locale";

const urlPrefix = "/api/RoomBlock";
export const listUrl = `${urlPrefix}/List`;

export const RoomBlockSWR = (search: any) => {
  if (!search.RoomBlockID) {
    search.RoomBlockID = 0;
  }
  if (!search.RoomID) {
    search.RoomID = 0;
  }
  // const values = {
  //     RoomBlockID: 0,
  //     StartDate: startDate,
  //     EndDate: endDate,
  //     RoomID: 0,
  // };

  const fetcher = async (url: any) =>
    await axios.post(url, search).then((res: any) => {
      let list = res.data.JsonData;
      return list;
    });

  const swrKey = [listUrl, JSON.stringify(search)];
  return useSWR(swrKey, fetcher);
};

export const RoomBlockAPI = {
  list: async (values: any) => {
    const { data, status } = await axios.post(listUrl, values);
    if (status != 200) {
      return [];
    }
    var list = data.JsonData;
    return list;
  },
  new: async (values: any) => {
    const { data, status } = await axios.post(`${urlPrefix}/New`, values);

    return {
      data,
      status,
    };
  },

  updateStatus: async (values: any) => {
    const { data, status } = await axios.post(
      `${urlPrefix}/UpdateStatus`,
      values
    );
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
      RoomTypeId: id,
    });

    return {
      data,
      status,
    };
  },
};
