import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { UserRoleSWR } from "lib/api/user-role";

const UserRoleSelect = ({ register, errors, field }: any) => {
    const { data, error } = UserRoleSWR({});

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
            label="Хэрэглэгчин төрөл"
            options={data}
            optionValue="UserRoleID"
            optionLabel="UserRoleName"
        />
    );
};

export default UserRoleSelect;
