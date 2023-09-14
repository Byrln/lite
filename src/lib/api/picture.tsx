import axios from "lib/utils/axios";
const urlPrefix = "/api/Picture";

export const PictureAPI = {
    upload: async (values: any) => {
        const { data, status } = await axios.post(
            `${urlPrefix}/Upload`,
            values,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return {
            data,
            status,
        };
    },
};
