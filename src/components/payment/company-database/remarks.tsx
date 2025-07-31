import { useState } from "react";

import { useForm } from "react-hook-form";
import { TextField, Grid, Card, CardContent, Typography } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { useAppState } from "lib/context/app";
import CountrySelect from "components/select/country";
import CustomerGroupSelect from "components/select/customer-group";
import CustomerTypeSelect from "components/select/customer-type";
import { GuestRemarkSWR, RemarkAPI, listUrl } from "lib/api/remarks";

const validationSchema = yup.object().shape({
    Remarks: yup.string().nullable(),
});

const Remarks = ({ GuestID }: any) => {
    const { data, error } = GuestRemarkSWR(GuestID);

    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <Card className="mt-3">
            <CardContent>
                <Typography
                    variant="subtitle1"
                    component="div"
                    className="mb-3"
                >
                    Remarks
                </Typography>

                <NewEditForm
                    api={RemarkAPI}
                    listUrl={listUrl}
                    additionalValues={{
                        GuestID: GuestID,
                    }}
                    reset={reset}
                    handleSubmit={handleSubmit}
                    handleModalNotAffected={true}
                    stateEditIdNotAffected={true}
                >
                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        id="Address"
                        label="Address"
                        {...register("Address")}
                        margin="dense"
                        error={!!errors.Address?.message}
                        helperText={errors.Address?.message as string}
                    />
                </NewEditForm>
            </CardContent>
        </Card>
    );
};

export default Remarks;
