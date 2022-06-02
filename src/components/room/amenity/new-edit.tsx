import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { AmenityAPI, listUrl } from "lib/api/amenity";
import AmenityTypeSelect from "components/select/amenity-type";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    AmenityTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    AmenityShortName: yup.string().required("Бөглөнө үү"),
    AmenityName: yup.string().required("Бөглөнө үү"),
    SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
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
            api={AmenityAPI}
            listUrl={listUrl}
            additionalValues={{ AmenityID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <AmenityTypeSelect register={register} errors={errors} />

            <TextField
                size="small"
                fullWidth
                id="AmenityShortName"
                label="Богино нэр"
                {...register("AmenityShortName")}
                margin="dense"
                error={errors.AmenityShortName?.message}
                helperText={errors.AmenityShortName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="AmenityName"
                label="Нэр"
                {...register("AmenityName")}
                margin="dense"
                error={errors.AmenityName?.message}
                helperText={errors.AmenityName?.message}
            />

            <TextField
                size="small"
                type="number"
                fullWidth
                id="SortOrder"
                label="Дараалал"
                {...register("SortOrder")}
                margin="dense"
                error={errors.SortOrder?.message}
                helperText={errors.SortOrder?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
