import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useState, useEffect } from "react";

import CustomSelect from "components/common/custom-select";
import { FolioSWR } from "lib/api/folio";

const FolioSelect = ({
    register,
    errors,
    TransactionID,
    customField,
    groupID = null,
    resetField,
    onChange,
}: any) => {
    const { data, error } = FolioSWR(TransactionID, groupID);

    useEffect(() => {
        if (resetField && data && data.length > 0) {
            resetField(`FolioID`, {
                defaultValue:
                    data && data[0] && data[0].FolioID ? data[0].FolioID : 0,
            });
            if (onChange) {
                onChange(
                    data && data[0] && data[0].FolioID ? data[0].FolioID : 0
                );
            }
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
        <CustomSelect
            register={register}
            errors={errors}
            field={customField ? customField : "FolioID"}
            label="Тооцоо"
            options={data}
            optionValue="FolioID"
            optionLabel="FolioFullName"
            onChange={onChange}
        />
    );
};

export default FolioSelect;
