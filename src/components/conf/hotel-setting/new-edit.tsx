import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { HotelSettingAPI, listUrl } from "lib/api/hotel-setting";
import { useAppState } from "lib/context/app";
import EditionSelect from "components/select/edition";
import { dateStringToObj } from "lib/utils/helpers";

const validationSchema = yup.object().shape({
    PMSStart: yup.date().required("Бөглөнө үү"),
    PMSEnd: yup.date().required("Бөглөнө үү"),
    EditionID: yup.number().notRequired(),
});

const NewEdit = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);

    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <NewEditForm
            api={HotelSettingAPI}
            listUrl={listUrl}
            additionalValues={{
                HotelID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setEntity}
        >
            <LocalizationProvider // @ts-ignore
                dateAdapter={AdapterDateFns} // @ts-ignore
            >
                <Grid container spacing={1}>
                    {state.editId && (
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="RowHeaderHotelCode"
                                    label={intl.formatMessage({id:"RowHeaderHotelCode"}) }
                                    {...register("RowHeaderHotelCode")}            
                                    margin="dense"
                                    error={errors.HotelCode?.message}
                                    helperText={errors.HotelCode?.message}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="RowHeaderHotelName"
                                    label={intl.formatMessage({id:"RowHeaderHotelName"}) }
                                    {...register("RowHeaderHotelCode")}    
                                    margin="dense"
                                    error={errors.HotelName?.message}
                                    helperText={errors.HotelName?.message}
                                    disabled
                                />
                            </Grid>{" "}
                        </>
                    )}

                    <Grid item xs={6}>
                        <Controller
                            name="PMSStart"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <DesktopDatePicker
                                    label="PMS Эхлэх огноо"
                                    value={value}
                                    onChange={(value) =>
                                        onChange(
                                            moment(
                                                dateStringToObj(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                "YYYY-MM-DD"
                                            )
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id={`PMSStart`}
                                            {...register(`PMSStart`)}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.PMSStart?.message}
                                            helperText={
                                                errors.PMSStart?.message
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="PMSEnd"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DesktopDatePicker
                                    label="PMS Дуусах огноо"
                                    value={value}
                                    onChange={(value) =>
                                        onChange(
                                            moment(
                                                dateStringToObj(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                "YYYY-MM-DD"
                                            )
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="PMSEnd"
                                            {...register("PMSEnd")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.PMSEnd?.message}
                                            helperText={errors.PMSEnd?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <EditionSelect
                            register={register}
                            errors={errors}
                            entity={entity}
                            setEntity={setEntity}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
