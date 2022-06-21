import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { ReservationSourceSWR } from "lib/api/reservation-source";

const ReservationSourceSelect = ({
    register,
    errors,
    label = "Reservation Source",
    ChannelID = 0,
}: any) => {
    const { data, error } = ReservationSourceSWR(ChannelID);

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
            field="ReservationSourceID"
            label={label}
            options={data}
            optionValue="ReservationSourceID"
            optionLabel="ReservationSourceName"
        />
    );
};

export default ReservationSourceSelect;
