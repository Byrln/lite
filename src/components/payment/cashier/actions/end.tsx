import { Controller, useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { mutate } from "swr";

import CustomSelect from "components/common/custom-select";
import NewEditForm from "components/common/new-edit-form";
import {
    CashierSessionAPI,
    detailUrl,
    summaryUrl,
} from "lib/api/cashier-session";

import CurrencySelect from "components/select/currency";

const validationSchema = yup.object().shape({
    CurrencyID: yup.string().required("Бөглөнө үү"),
    EndBalance: yup.string().required("Бөглөнө үү"),
    Description: yup.string().notRequired(),
});

const NewEdit = ({ SessionID }: any) => {
    const [baseStay, setBaseStay]: any = useState({ CurrencyID: 154 });

    const {
        register,
        reset,
        resetField,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            CurrencyID: 154,
            EndBalance: null,
            Description: null,
        },
    });

    const customSubmit = async (values: any) => {
        try {
            await CashierSessionAPI.end(values);
        } finally {
            await mutate(`/api/CashierSession/List`);
        }
    };

    return (
        <NewEditForm
            api={CashierSessionAPI}
            listUrl="/api/CashierSession/List"
            additionalValues={{
                SessionID: SessionID,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <CurrencySelect
                        register={register}
                        errors={errors}
                        nameKey={`CurrencyID`}
                        entity={baseStay}
                        setEntity={setBaseStay}
                    />
                </Grid>

                <Grid item xs={8}>
                    <TextField
                        type="number"
                        fullWidth
                        id="EndBalance"
                        label="Дүн"
                        InputProps={{ inputProps: { min: 0 } }}
                        {...register("EndBalance")}
                        margin="dense"
                        size="small"
                        error={!!errors.EndBalance?.message}
                        helperText={errors.EndBalance?.message}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Description"
                        label="Description"
                        {...register("Description")}
                        margin="dense"
                        error={!!errors.Description?.message}
                        helperText={errors.Description?.message}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
