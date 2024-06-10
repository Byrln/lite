import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useIntl } from "react-intl";

import CustomSelect from "components/common/custom-select";
import { ReservationSourceSWR } from "lib/api/reservation-source";

const ReservationSourceSelect = ({
    register,
    errors,
    label,
    ChannelID = 0,
    field = "ReservationSourceID",
}: any) => {
    const intl = useIntl();
    const { data, error } = ReservationSourceSWR({ ChannelID: ChannelID });

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
            field={field}
            label={
                label
                    ? label
                    : intl.formatMessage({
                          id: "TextReservationSource",
                      })
            }
            options={data}
            optionValue="ReservationSourceID"
            optionLabel="ReservationSourceName"
        />
    );
};

export default ReservationSourceSelect;
