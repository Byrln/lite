import { Controller, useForm } from "react-hook-form";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import NewEditForm from "components/common/new-edit-form";
import { FolioAPI, listUrl } from "lib/api/folio";

const validationSchema = yup.object().shape({
    CheckRC: yup.string().notRequired(),
    CheckEC: yup.string().notRequired(),
});

const NewEdit = ({ FolioID, handleModal }: any) => {
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const customSubmit = async (values: any) => {
        try {
            FolioAPI.cut(values);
            handleModal();
        } finally {
            handleModal();
        }
    };

    return (
        <NewEditForm
            api={FolioAPI}
            listUrl={listUrl}
            additionalValues={{ FolioID: FolioID }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Controller
                                name="Room Charge"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        key={`CheckRC`}
                                        {...register(`CheckRC`)}
                                    />
                                )}
                            />
                        }
                        label="Room Charge"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Controller
                                name="Extra Charge"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        key={`CheckEC`}
                                        {...register(`CheckEC`)}
                                    />
                                )}
                            />
                        }
                        label="Extra Charge"
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
