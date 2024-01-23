import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { UserByRoleSWR } from "lib/api/user";
import CustomSelect from "components/common/custom-select";

const UserSelect = ({
    register,
    errors,
    label,
    IsHouseKeeper = false,
    nameKey,
}: any) => {
    const { data, error } = UserByRoleSWR({ IsHouseKeeper: IsHouseKeeper });

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
            field={nameKey ? nameKey : "UserID"}
            label={label}
            options={data}
            optionValue="UserID"
            optionLabel="UserName"
        />
    );
};

export default UserSelect;
