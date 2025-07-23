import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

import { useIntl } from "react-intl";

import { PosApiDistrictListSWR } from "lib/api/pos-api";

const DistrictSelect = ({ register, errors, entity, setEntity }: any) => {
    const intl = useIntl();
    const { data, error } = PosApiDistrictListSWR();
    const [uniqueDistricts, setUniqueDistricts] = useState([]);

    // Helper function to remove duplicates based on key
    const removeDuplicates = (arr: any, key: any) => {
        return arr.filter(
            (item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => t[key] === item[key])
        );
    };

    useEffect(() => {
        if (data) {
            setUniqueDistricts(
                removeDuplicates(
                    data.map((item: any) => ({
                        DistrictCode: item.DistrictCode,
                        DistrictName: item.DistrictName,
                    })),
                    "DistrictCode"
                )
            );
        }
    }, [data]);

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                {" "}
                <TextField
                    size="small"
                    fullWidth
                    id="DistrictCode"
                    label={intl.formatMessage({ id: "TextDistrict" })}
                    {...register("DistrictCode")}
                    select
                    margin="dense"
                    error={!!errors.DistrictCode?.message}
                    helperText={errors.DistrictCode?.message}
                    value={entity && entity.DistrictCode}
                    InputLabelProps={{
                        shrink: entity && entity.DistrictCode,
                    }}
                    onChange={(evt: any) => {
                        setEntity &&
                            setEntity({
                                ...entity,
                                DistrictCode: evt.target.value,
                            });
                    }}
                >
                    {uniqueDistricts &&
                        uniqueDistricts.map((district: any) => (
                            <MenuItem
                                key={district.DistrictCode}
                                value={district.DistrictCode}
                            >
                                {district.DistrictName}
                            </MenuItem>
                        ))}
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    size="small"
                    fullWidth
                    id="SubDistrictCode"
                    {...register("SubDistrictCode")}
                    select
                    margin="dense"
                    error={!!errors.SubDistrictCode?.message}
                    helperText={errors.SubDistrictCode?.message}
                    value={entity && entity.SubDistrictCode}
                    InputLabelProps={{
                        shrink: entity && entity.SubDistrictCode,
                    }}
                    onChange={(evt: any) => {
                        setEntity &&
                            setEntity({
                                ...entity,
                                SubDistrictCode: evt.target.value,
                            });
                    }}
                >
                    {data &&
                        data
                            .filter((item: any) =>
                                entity
                                    ? item.DistrictCode == entity.DistrictCode
                                    : true
                            )
                            .map((district: any) => (
                                <MenuItem
                                    key={district.SubDistrictCode}
                                    value={district.SubDistrictCode}
                                >
                                    {district.SubDistrictName}
                                </MenuItem>
                            ))}
                </TextField>
            </Grid>
        </Grid>
    );
};

export default DistrictSelect;
