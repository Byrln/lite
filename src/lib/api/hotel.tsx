import axios from "lib/utils/axios";

const urlPrefix = "/api/Hotel";

export const HotelAPI = {
    get: async () => {
        const res = await axios.get(`${urlPrefix}/Details`);

        return JSON.parse(res.data.JsonData);
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
};
