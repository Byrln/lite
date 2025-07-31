import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { RoomStatusAPI, listUrl } from "lib/api/room-status";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    StatusColor: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
    const intl = useIntl();
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const [entity, setEntity] = useState<any>();

    const [value, setValue] = useState("#ffffff");

    useEffect(() => {
        if (entity && entity.StatusColor) {
            setValue(entity.StatusColor);
        }
    }, [entity]);

    const handleChange = (newValue: any) => {
        setValue(newValue);
    };

    const beforeSubmit = (values: any) => {
        if (values.StatusColor) {
            if (values.StatusColor[0] == "#") {
                values.StatusColor = values.StatusColor.slice(1);
            }
        }
    };

    return (
        <NewEditForm
            api={RoomStatusAPI}
            listUrl={listUrl}
            additionalValues={{ RoomStatusID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setEntity}
            customModificationBeforeSubmit={beforeSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        disabled
                        fullWidth
                        id="StatusCode"
                        label={intl.formatMessage({id:"RoomStatus"}) }
                        {...register("StatusCode")}
                        margin="dense"
                        error={!!errors.RoomNo?.message}
                        helperText={errors.RoomNo?.message as string}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="StatusColor"
                        label={intl.formatMessage({id:"RowHeaderColor"}) }
                        {...register("StatusColor")}
                        margin="dense"
                        error={!!errors.StatusColor?.message}
                        helperText={errors.StatusColor?.message as string}
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        type="color"
                        InputProps={{
                            style: { height: '40px' }
                        }}
                    />
                </Grid>
                {/* <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="StatusColor"
                        label="Өнгө"
                        {...register("StatusColor")}
                        margin="dense"
                        error={!!errors.StatusColor?.message}
                        helperText={errors.StatusColor?.message as string}
                    />
                </Grid> */}
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Description"
                        label={intl.formatMessage({id:"RowHeaderDescription"}) }
                        {...register("Description")}
                        margin="dense"
                        error={!!errors.Description?.message}
                        helperText={errors.Description?.message as string}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
