import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { AmenityAPI, listUrl } from "lib/api/amenity";
import AmenityTypeSelect from "components/select/amenity-type";

const NewEdit = ({ entity }: any) => {
    const validationSchema = yup.object().shape({
        AmenityTypeID: yup.number().required("Бөглөнө үү"),
        AmenityShortName: yup.string().required("Бөглөнө үү"),
        AmenityName: yup.string().required("Бөглөнө үү"),
        SortOrder: yup.number().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={AmenityAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
        >
            <AmenityTypeSelect register={register} errors={errors} />

            <TextField
                fullWidth
                id="AmenityShortName"
                label="Богино нэр"
                {...register("AmenityShortName")}
                margin="dense"
                error={errors.AmenityShortName?.message}
                helperText={errors.AmenityShortName?.message}
            />

            <TextField
                fullWidth
                id="AmenityName"
                label="Нэр"
                {...register("AmenityName")}
                margin="dense"
                error={errors.AmenityName?.message}
                helperText={errors.AmenityName?.message}
            />

            <TextField
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
