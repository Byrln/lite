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
    Grid,
} from "@mui/material";
import { mutate } from "swr";

import { UserRolePrivilegeSWR } from "lib/api/user-role";
import { useEffect, useState } from "react";

const UserRolePrivilegeSelect = ({
    register,
    errors,
    type,
    title,
    UserRoleID,
}: any) => {
    console.log("UserRoleID", UserRoleID);
    // console.log(register)
    const { data, error } = UserRolePrivilegeSWR(UserRoleID);
    const [permissions, setPermissions] = useState(data ? data : []);
    if (error) return <Alert severity="error">{error.message}</Alert>;
    console.log("data", data);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // console.log(data)
        if (data && data.length > 0) {
            setPermissions(data);
        }
    }, [data]);

    useEffect(() => {
        (async () => {
            await mutate(`/api/UserRole/GetPrivileges`, {
                UserRoleID: UserRoleID,
                ActionGroupType: 0,
            });
        })();
    }, [UserRoleID]);

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    // @ts-ignore
    const handleAllCheckboxes = (e) => {
        // @ts-ignore
        const changedPermissions = permissions.map((permission) => {
            permission.Status = e.target.checked;
            return permission;
        });
        setPermissions(changedPermissions);
    };

    // @ts-ignore
    const handleToggle = (element) => (e) => {
        // @ts-ignore
        const changedPermissions = permissions.map((permission) => {
            if (
                permission.GroupID === element.GroupID &&
                permission.ActionID === element.ActionID
            ) {
                element.Status = e.target.checked;
                // No change
                return element;
            } else {
                // Return a new circle 50px below
                return permission;
            }
        });
        setPermissions(changedPermissions);
    };

    return (
        <FormControl sx={{ mt: 2 }} component="fieldset" variant="standard">
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <FormLabel component="legend">{title}</FormLabel>
                </Grid>
                <Grid item xs={10} textAlign={"right"}>
                    <FormControlLabel
                        title={title}
                        control={<Checkbox onChange={handleAllCheckboxes} />}
                        label="Check all"
                    ></FormControlLabel>
                </Grid>
            </Grid>

            <FormGroup>
                <Grid container spacing={1}>
                    {permissions.map(
                        (element: any, index: number) =>
                            element &&
                            element.GroupType === type && (
                                <Grid item xs={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                ref={title}
                                                {...register("ActionID")}
                                                checked={element.Status}
                                                onChange={handleToggle(element)}
                                                value={element.ActionID}
                                            />
                                        }
                                        label={element.ActionName}
                                    />
                                </Grid>
                            )
                    )}
                </Grid>
            </FormGroup>
            <FormHelperText error>{errors.ActionID?.message}</FormHelperText>
        </FormControl>
    );
};

export default UserRolePrivilegeSelect;
