import axios from "../utils/axios";

const uri = "/api/FrontOffice/StayView";

const StayViewApi = {
  list: async (values: any) => {
    const { status, data }: any = await axios.post(`${uri}`, values);

    console.log("============== response ===================");
    console.log(status);
    console.log(data);

    if (status != 200) {
      return {
        status: "error",
        statusCode: status,
        msg: "Connection error",
        result: null,
      };
    }

    /*
Status: true,
Code: '',
Message: '',
JsonData:
     */

    return {
      status: "success",
      statusCode: status,
      msg: data.Message,
      result: JSON.parse(data.JsonData),
    };
  },
  //   new: async (values: any) => {
  //     const { data, status } = await axios.post(urlPrefix, values);
  //     return {
  //       data,
  //       status,
  //     };
  //   },
  //   update: async (id: any, values: any) => {
  //     const { data, status } = await axios.put(`${urlPrefix}/${id}`, values);
  //     return {
  //       data,
  //       status,
  //     };
  //   },
  //   delete: (id: any) => axios.delete(`${urlPrefix}/${id}`),
};

export default StayViewApi;
