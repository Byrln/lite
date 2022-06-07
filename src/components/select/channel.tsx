import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { ChannelSWR } from "lib/api/reference";

const ChannelSelect = ({ register, errors }: any) => {
    const { data, error } = ChannelSWR();

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <CustomSelect
            register={register}
            errors={errors}
            field="ChannelID"
            label="ChannelID"
            options={data}
            optionValue="ChannelID"
            optionLabel="ChannelName"
        />
    );
};

export default ChannelSelect;
