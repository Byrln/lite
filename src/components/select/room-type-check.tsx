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

import { useEffect, useState } from "react";
import { RoomTypeAPI, RoomTypeSWR } from "lib/api/room-type";

const UserRolePrivilegeSelect = ({
    register,
    errors,
    type,
    title,
    resetField,
    setAllCheck,
    allCheck,
    initialChecks,
}: any) => {
    // const { data, error } = RoomTypeSWR({});

    const [sources, setSources] = useState<any>([]);
    // if (error) return <Alert severity="error">{error.message}</Alert>;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const fetchDatas = async () => {
            // setLoadingData(true);

            try {
                let tempValues: any = [];

                const arr: any = await RoomTypeAPI?.list([]);
                if (arr) {
                    if (allCheck == true) {
                        setSources(
                            arr
                                .filter((item: any) => item.Status == true)
                                .map((source: any) => {
                                    source.CheckStatus = true;
                                    tempValues.push(source.RoomTypeID);
                                    return source;
                                })
                        );
                    } else {
                        setSources(
                            arr
                                .filter((item: any) => item.Status == true)
                                .map((source: any) => {
                                    if (
                                        initialChecks &&
                                        initialChecks.includes(
                                            String(source.RoomTypeID)
                                        )
                                    ) {
                                        source.CheckStatus = true;
                                    }
                                    tempValues.push(source.RoomTypeID);
                                    return source;
                                })
                        );
                    }
                }
                resetField(`RoomTypeIDs`, {
                    defaultValue: tempValues,
                });
            } finally {
            }
        };
        fetchDatas();
    }, []);

    // if (!error && !data)
    //     return (
    //         <Box sx={{ width: "100%" }}>
    //             <Skeleton />
    //             <Skeleton animation="wave" />
    //         </Box>
    //     );

    // @ts-ignore
    const handleAllCheckboxes = (e) => {
        let tempValues: any = [];

        // @ts-ignore
        const changedSources = sources.map((source) => {
            source.CheckStatus = e.target.checked;
            if (e.target.checked == true) {
                tempValues.push(source.RoomTypeID);
            }
            return source;
        });
        setAllCheck(e.target.checked);
        resetField(`RoomTypeIDs`, {
            defaultValue: tempValues,
        });
        setSources(changedSources);
    };

    // @ts-ignore
    const handleToggle = (element) => (e) => {
        // @ts-ignore
        const changedSources = sources.map((source) => {
            if (source.RoomTypeID === element.RoomTypeID) {
                element.CheckStatus = e.target.checked;
                // No change
                return element;
            } else {
                // Return a new circle 50px below
                return source;
            }
        });
        setSources(changedSources);
    };

    return (
        <FormControl
            sx={{ mt: 2 }}
            component="fieldset"
            variant="standard"
            style={{ width: "100%" }}
        >
            <Grid container spacing={1}>
                <Grid item xs={8}>
                    <FormLabel component="legend">{title}</FormLabel>
                </Grid>
                <Grid item xs={4} textAlign={"right"}>
                    <FormControlLabel
                        title={title}
                        control={
                            <Checkbox
                                onChange={handleAllCheckboxes}
                                checked={allCheck}
                            />
                        }
                        label="Check all"
                    ></FormControlLabel>
                </Grid>
            </Grid>

            <FormGroup>
                <Grid container spacing={1}>
                    {sources &&
                        sources.map((element: any, index: number) => (
                            <Grid item xs={6} key={index}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            ref={title}
                                            {...register("RoomTypeIDs")}
                                            checked={
                                                element.CheckStatus
                                                    ? element.CheckStatus
                                                    : false
                                            }
                                            onChange={handleToggle(element)}
                                            value={element.RoomTypeID}
                                        />
                                    }
                                    label={element.RoomTypeName}
                                />
                            </Grid>
                        ))}
                </Grid>
            </FormGroup>
            <FormHelperText error>{errors.ActionID?.message}</FormHelperText>
        </FormControl>
    );
};

export default UserRolePrivilegeSelect;
