import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { RateTypeAPI, listUrl } from "lib/api/rate-type";
import { useAppState } from "lib/context/app";
import ChannelSelect from "components/select/channel";
import BaseRateList from "./base-rate-list";

const validationSchema = yup.object().shape({
    RateTypeCode: yup.string().required("Бөглөнө үү"),
    RateTypeName: yup.string().required("Бөглөнө үү"),
    ChannelID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BreakfastIncluded: yup.boolean(),
    TaxIncluded: yup.boolean(),
    // RoomTypes: yup.array().of(
    //     yup.object().shape({
    //         BaseRate: yup.number(),
    //         ExtraAdult: yup.number(),
    //         ExtraChild: yup.number(),
    //     })
    // ),
});

const NewEdit = () => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    return (
        <NewEditForm
            api={RateTypeAPI}
            listUrl={listUrl}
            additionalValues={{ RateTypeID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="RateTypeCode"
                label="Short Code"
                {...register("RateTypeCode")}
                margin="dense"
                error={errors.RateTypeCode?.message}
                helperText={errors.RateTypeCode?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="RateTypeName"
                label="Rate Type"
                {...register("RateTypeName")}
                margin="dense"
                error={errors.RateTypeName?.message}
                helperText={errors.RateTypeName?.message}
            />

            <ChannelSelect register={register} errors={errors} />

            <FormControlLabel
                control={
                    <Controller
                        name="BreakfastIncluded"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("BreakfastIncluded")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="BreakfastIncluded"
            />

            <FormControlLabel
                control={
                    <Controller
                        name="TaxIncluded"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("TaxIncluded")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="Room Rates inclusive of total 10% + 1%"
            />

            <BaseRateList
                id={state.editId ? state.editId : -1}
                register={register}
                errors={errors}
                control={control}
            />
        </NewEditForm>
    );
};

export default NewEdit;
