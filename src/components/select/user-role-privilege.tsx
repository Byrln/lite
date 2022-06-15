import {
    Box,
    Skeleton,
    Checkbox,
    Alert,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";

import { UserRolePrivilegeSWR } from "lib/api/user-role";

const UserRolePrivilegeSelect = ({ register, errors, type, title }: any) => {
    const { data, error } = UserRolePrivilegeSWR();

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <FormControl sx={{ mt: 2 }} component="fieldset" variant="standard">
            <FormLabel component="legend">{title}</FormLabel>

            <FormGroup>
                <Box display="flex" flexWrap="wrap">
                    {data.map(
                        (element: any, index: number) =>
                            element.GroupType === type && (
                                <Box key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register("ActionID")}
                                            />
                                        }
                                        label={element.ActionName}
                                    />
                                </Box>
                            )
                    )}
                </Box>
            </FormGroup>
            <FormHelperText error>{errors.ActionID?.message}</FormHelperText>
        </FormControl>
    );
};

export default UserRolePrivilegeSelect;
