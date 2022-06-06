import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { TaxAPI, listUrl } from "lib/api/tax";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    TaxCode: yup.string().required("Бөглөнө үү"),
    TaxName: yup.string().required("Бөглөнө үү"),
    TaxAmount: yup.number().required("Бөглөнө үү"),
    BeginDate: yup.date().required("Бөглөнө үү"),
    EndDate: yup.date().required("Бөглөнө үү"),
});

const NewEdit = ({ entity }: any) => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    return (
        <NewEditForm
            api={TaxAPI}
            listUrl={listUrl}
            additionalValues={{ RateTypeID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                fullWidth
                id="TaxCode"
                label="Код"
                {...register("TaxCode")}
                margin="dense"
                error={errors.TaxCode?.message}
                helperText={errors.TaxCode?.message}
            />

            <TextField
                fullWidth
                id="TaxName"
                label="Нэр"
                {...register("TaxName")}
                margin="dense"
                error={errors.TaxName?.message}
                helperText={errors.TaxName?.message}
            />

            <TextField
                type="number"
                fullWidth
                id="TaxAmount"
                label="Дүн"
                InputProps={{ inputProps: { min: 0, max: 99 } }}
                {...register("TaxAmount")}
                margin="dense"
                error={errors.TaxAmount?.message}
                helperText={errors.TaxAmount?.message}
            />
            <TextField
                type="date"
                fullWidth
                id="BeginDate"
                label="Эхлэх огноо"
                {...register("BeginDate")}
                margin="dense"
                error={errors.BeginDate?.message}
                helperText={errors.BeginDate?.message}
            />
            <TextField
                type="date"
                fullWidth
                id="EndDate"
                label="Дуусах огноо"
                {...register("EndDate")}
                margin="dense"
                error={errors.EndDate?.message}
                helperText={errors.EndDate?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
