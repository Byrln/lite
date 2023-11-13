import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { BankAccountAPI, listUrl } from "lib/api/bank-account";
import { useAppState } from "lib/context/app";
import LanguageSelect from "components/select/language";
import UserRoleSelect from "components/select/user-role";

const validationSchema = yup.object().shape({
    Bank: yup.string().required("Бөглөнө үү"),
    AccountNo: yup.string().required("Бөглөнө үү"),
    AccountName: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <NewEditForm
            api={BankAccountAPI}
            listUrl={listUrl}
            additionalValues={{
                HotelBankAccountID: state.editId,
                BankAccountID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Bank"
                        label="Банк"
                        {...register("Bank")}
                        margin="dense"
                        error={errors.Bank?.message}
                        helperText={errors.Bank?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="AccountNo"
                        label="Дансны дугаар"
                        {...register("AccountNo")}
                        margin="dense"
                        error={errors.AccountNo?.message}
                        helperText={errors.AccountNo?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="AccountName"
                        label="Дансны нэр"
                        {...register("AccountName")}
                        margin="dense"
                        error={errors.AccountName?.message}
                        helperText={errors.AccountName?.message}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
