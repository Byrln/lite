import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/lab";
import moment from "moment";

import NewEditForm from "components/common/new-edit-form";
import { PromotionAPI, listUrl } from "lib/api/promotion";
import { useAppState } from "lib/context/app";
import PromotionTypeSelect from "components/select/promotion-type";
import CustomSelect from "components/common/custom-select";
import ReservationSourceSelect from "components/select/reservation-source";
import RoomTypeSelect from "components/select/room-type";

const validationSchema = yup.object().shape({
    PromotionCode: yup.string().required("Бөглөнө үү"),
    PromotionType: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    BeginDate: yup.date().required("Бөглөнө үү"),
    EndDate: yup.date().required("Бөглөнө үү"),
    AvailableOn: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
});

const NewEdit = () => {
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
            api={PromotionAPI}
            listUrl={listUrl}
            additionalValues={{
                PromotionID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="PromotionCode"
                label="Promotion Code"
                {...register("PromotionCode")}
                margin="dense"
                error={errors.PromotionCode?.message}
                helperText={errors.PromotionCode?.message}
            />

            <PromotionTypeSelect register={register} errors={errors} />

            <TextField
                size="small"
                fullWidth
                multiline
                rows={3}
                id="Description"
                label="Description"
                {...register("Description")}
                margin="dense"
                error={errors.Description?.message}
                helperText={errors.Description?.message}
            />

            <Controller
                name="BeginDate"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                    <DatePicker
                        label="Begin Date"
                        value={value}
                        onChange={(value) =>
                            onChange(moment(value).format("YYYY-MM-DD"))
                        }
                        renderInput={(params) => (
                            <TextField
                                size="small"
                                id="BeginDate"
                                {...register("BeginDate")}
                                margin="dense"
                                fullWidth
                                {...params}
                                error={errors.BeginDate?.message}
                                helperText={errors.BeginDate?.message}
                            />
                        )}
                    />
                )}
            />

            <Controller
                name="EndDate"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                    <DatePicker
                        label="End Date"
                        value={value}
                        onChange={(value) =>
                            onChange(moment(value).format("YYYY-MM-DD"))
                        }
                        renderInput={(params) => (
                            <TextField
                                size="small"
                                id="EndDate"
                                {...register("EndDate")}
                                margin="dense"
                                fullWidth
                                {...params}
                                error={errors.EndDate?.message}
                                helperText={errors.EndDate?.message}
                            />
                        )}
                    />
                )}
            />

            <CustomSelect
                register={register}
                errors={errors}
                field="AvailableOn"
                label="Available On"
                options={[
                    { key: 1, value: "Өдөр бүр" },
                    { key: 2, value: "Эхний өдөр" },
                    { key: 3, value: "Сүүлийн өдөр" },
                ]}
                optionValue="key"
                optionLabel="value"
            />

            <FormControlLabel
                control={
                    <Controller
                        name="AllSource"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("AllSource")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="All Booking Source"
            />

            <ReservationSourceSelect
                register={register}
                errors={errors}
                label="Booking Source"
                ChannelID={2}
            />

            <FormControlLabel
                control={
                    <Controller
                        name="AllRoomType"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("AllRoomType")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="All Room Type"
            />

            <RoomTypeSelect register={register} errors={errors} />
        </NewEditForm>
    );
};

export default NewEdit;
