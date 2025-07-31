import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { ReferenceSWR } from "lib/api/reference";
import CustomSelect from "components/common/custom-select";

const NotificationTypeSelect = ({
    register,
    errors,
    field,
    label = "Notification Type",
}: any) => {
    const { data, error } = ReferenceSWR("NotificationType");

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
            label={label}
            options={data}
            optionValue="NotificationTypeID"
            optionLabel="NotificationTypeName"
        />
    );
};

export default NotificationTypeSelect;