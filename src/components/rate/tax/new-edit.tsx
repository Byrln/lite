import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { TaxAPI, listUrl } from "lib/api/tax";

const NewEdit = ({ entity }: any) => {
    const validationSchema = yup.object().shape({
        TaxCode: yup.string().required("Бөглөнө үү"),
        TaxName: yup.string().required("Бөглөнө үү"),
        TaxAmount: yup.number().required("Бөглөнө үү"),
        BeginDate: yup.date().required("Бөглөнө үү"),
        EndDate: yup.date().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={TaxAPI}
            entity={entity}
            listUrl={listUrl}
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
