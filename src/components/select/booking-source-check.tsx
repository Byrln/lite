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

import { useEffect, useState } from "react";
import {
    ReservationSourceSWR,
    ReservationSourceAPI,
} from "lib/api/reservation-source";

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
    const [sources, setSources] = useState<any>([]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const fetchDatas = async () => {
            // setLoadingData(true);

            try {
                let tempValues: any = [];

                const arr: any = await ReservationSourceAPI?.list({
                    ChannelID: 2,
                });
                if (arr) {
                    if (allCheck == true) {
                        await setSources(
                            arr
                                .filter((item: any) => item.Status == true)
                                .map((source: any) => {
                                    source.CheckStatus = true;
                                    tempValues.push(source.ReservationSourceID);
                                    return source;
                                })
                        );
                    } else {
                        await setSources(
                            arr
                                .filter((item: any) => item.Status == true)
                                .map((source: any) => {
                                    if (
                                        initialChecks &&
                                        initialChecks.includes(
                                            String(source.ReservationSourceID)
                                        )
                                    ) {
                                        source.CheckStatus = true;
                                    }
                                    tempValues.push(source.ReservationSourceID);
                                    return source;
                                })
                        );
                    }
                }
                resetField(`SourceIDs`, {
                    defaultValue: tempValues,
                });
            } finally {
            }
        };
        fetchDatas();
    }, []);

    // @ts-ignore
    const handleAllCheckboxes = (e) => {
        // @ts-ignore
        let tempValues: any = [];
        const changedSources = sources.map((source: any) => {
            source.CheckStatus = e.target.checked;
            if (e.target.checked == true) {
                tempValues.push(source.ReservationSourceID);
            }
            return source;
        });
        setAllCheck(e.target.checked);

        resetField(`SourceIDs`, {
            defaultValue: tempValues,
        });
        setSources(changedSources);
    };

    // @ts-ignore
    const handleToggle = (element) => (e) => {
        // @ts-ignore
        const changedSources = sources.map((source) => {
            if (source.ReservationSourceID === element.ReservationSourceID) {
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
                        sources.map(
                            (element: any, index: number) =>
                                element &&
                                element.GroupType === type && (
                                    <Grid item xs={6} sm={4} md={3}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    ref={title}
                                                    {...register("SourceIDs")}
                                                    checked={
                                                        element.CheckStatus
                                                            ? element.CheckStatus
                                                            : false
                                                    }
                                                    onChange={handleToggle(
                                                        element
                                                    )}
                                                    value={
                                                        element.ReservationSourceID
                                                    }
                                                />
                                            }
                                            label={
                                                element.ReservationSourceName
                                            }
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
