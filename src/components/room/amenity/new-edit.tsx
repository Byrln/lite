import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";

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
    const intl = useIntl();
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        defaultValues: { AmenityTypeID: 1 },
        resolver: yupResolver(validationSchema),
    });

    return (
        <NewEditForm
            api={AmenityAPI}
            listUrl={listUrl}
            additionalValues={{ AmenityID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <AmenityTypeSelect register={register} errors={errors} />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="AmenityShortName"
                        label={intl.formatMessage({ id: "AmenityShortName" })}
                        {...register("AmenityShortName")}
                        margin="dense"
                        error={!!errors.AmenityShortName?.message}
                        helperText={errors.AmenityShortName?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="AmenityName"
                        label={intl.formatMessage({ id: "AmenityName" })}
                        {...register("AmenityName")}
                        margin="dense"
                        error={!!errors.AmenityName?.message}
                        helperText={errors.AmenityName?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="SortOrder"
                        label={intl.formatMessage({ id: "SortOrder" })}
                        {...register("SortOrder")}
                        defaultValue={1}
                        margin="dense"
                        error={!!errors.SortOrder?.message}
                        helperText={errors.SortOrder?.message}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
