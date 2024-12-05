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
import { FrontOfficeAPI } from "lib/api/front-office";

const UserRolePrivilegeSelect = ({
    register,
    errors,
    type,
    title,
    resetField,
    setAllCheck,
    allCheck,
    initialChecks,
    GroupID = null,
    TransactionID = null,
}: any) => {
    const [sources, setSources] = useState<any>([]);

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                let tempValues: any = [];

                const arr: any = await FrontOfficeAPI?.transactionInfoList({
                    GroupID: GroupID,
                    TransactionID: TransactionID,
                });

                if (arr) {
                    if (allCheck == true) {
                        await setSources(
                            arr.map((source: any) => {
                                source.CheckStatus = true;
                                tempValues.push(source.RoomID);
                                return source;
                            })
                        );
                    } else {
                        await setSources(
                            arr.map((source: any) => {
                                if (
                                    initialChecks &&
                                    initialChecks.includes(
                                        String(source.RoomID)
                                    )
                                ) {
                                    source.CheckStatus = true;
                                }
                                tempValues.push(source.RoomID);
                                return source;
                            })
                        );
                    }
                }
            } finally {
            }
        };
        fetchDatas();
    }, []);

    const handleAllCheckboxes = (e: any) => {
        let tempValues: any = [];
        const changedSources = sources.map((source: any) => {
            source.CheckStatus = e.target.checked;
            if (e.target.checked == true) {
                tempValues.push(source.RoomID.toString());
            }
            return source;
        });
        setAllCheck(e.target.checked);

        resetField(`RoomIDs`, {
            defaultValue: tempValues,
        });
        setSources(changedSources);
    };

    const handleToggle = (element: any) => (e: any) => {
        const changedSources = sources.map((source: any) => {
            if (source.RoomID === element.RoomID) {
                element.CheckStatus = e.target.checked;
                return element;
            } else {
                return source;
            }
        });
        setSources(changedSources);
    };

    return (
        <FormControl
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
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    ref={title}
                                                    {...register("RoomIDs")}
                                                    checked={
                                                        element.CheckStatus
                                                            ? element.CheckStatus
                                                            : false
                                                    }
                                                    onChange={handleToggle(
                                                        element
                                                    )}
                                                    value={element.RoomID}
                                                />
                                            }
                                            label={element.RoomFullNo}
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
