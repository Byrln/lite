import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useState, useEffect } from "react";

import CustomSelect from "components/common/custom-select";
import { CashDrawerSWR } from "lib/api/cash-drawer";

const CashDrawerSelect = ({
    register,
    errors,
    customField,
    resetField,
}: any) => {
    const { data, error } = CashDrawerSWR();

    useEffect(() => {
        if (resetField && data && data.length > 0) {
            resetField(`CashDrawerID`, {
                defaultValue:
                    data && data[0] && data[0].CashDrawerID
                        ? data[0].CashDrawerID
                        : 0,
            });
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
            field={customField ? customField : "CashDrawerID"}
            label="Касс"
            options={data}
            optionValue="CashDrawerID"
            optionLabel="CashDrawerName"
        />
    );
};

export default CashDrawerSelect;
