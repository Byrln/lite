import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { NotificationUserItemSWR } from "lib/api/notification";

const UserRoleSelect = ({ register, errors, field, UserTypeID }: any) => {
    const { data, error } = NotificationUserItemSWR({ UserTypeID: UserTypeID });

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
            label="Item"
            options={data}
            optionValue="ItemID"
            optionLabel="ItemName"
        />
    );
};

export default UserRoleSelect;
