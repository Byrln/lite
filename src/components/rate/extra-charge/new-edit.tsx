import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ChargeTypeAPI, listUrl } from "lib/api/charge-type";
import ChargeTypeGroupSelect from "components/select/charge-type-group";
import { useAppState } from "lib/context/app";
import { useIntl } from "react-intl";
const validationSchema = yup.object().shape({
    RoomChargeTypeGroupID: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    RoomChargeTypeName: yup.string().required("Бөглөнө үү"),
    RoomChargeTypeRate: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    IsEditable: yup.boolean(),
    IsInclusion: yup.boolean(),
});

const NewEdit = () => {
    const intl = useIntl();
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
            api={ChargeTypeAPI}
            listUrl={listUrl}
            additionalValues={{
                RoomChargeTypeID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <ChargeTypeGroupSelect
                        register={register}
                        errors={errors}
                        IsRoomCharge={null}
                        IsExtraCharge={true}
                        IsMiniBar={false}
                        IsDiscount={null}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RoomChargeTypeName"
                        label={intl.formatMessage({ id: "RowHeaderFirstName" })}
                        {...register("RoomChargeTypeName")}
                        margin="dense"
                        error={errors.RoomChargeTypeName?.message}
                        helperText={errors.RoomChargeTypeName?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="RoomChargeTypeRate"
                        label={intl.formatMessage({ id: "RoomChargeTypeRate" })}
                        {...register("RoomChargeTypeRate")}
                        margin="dense"
                        error={errors.RoomChargeTypeRate?.message}
                        helperText={errors.RoomChargeTypeRate?.message}
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
                        error={errors.SortOrder?.message}
                        helperText={errors.SortOrder?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Controller
                                name="IsEditable"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        {...register("IsEditable")}
                                        checked={props.field.value}
                                        onChange={(e) =>
                                            props.field.onChange(
                                                e.target.checked
                                            )
                                        }
                                    />
                                )}
                            />
                        }
                        label="Үнийн дүнг засах боломжтой эсэх"
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Controller
                                name="IsInclusion"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        {...register("IsInclusion")}
                                        checked={props.field.value}
                                        onChange={(e) =>
                                            props.field.onChange(
                                                e.target.checked
                                            )
                                        }
                                    />
                                )}
                            />
                        }
                        label="Is Inclusion"
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
