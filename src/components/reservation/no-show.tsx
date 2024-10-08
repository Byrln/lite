import { TextField, Grid, Checkbox, FormControlLabel } from "@mui/material";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

import { ReservationAPI } from "lib/api/reservation";
import { ModalContext } from "lib/context/modal";
import { listUrl } from "lib/api/front-office";
import { dateToCustomFormat } from "lib/utils/format-time";
import { RateAPI } from "../../lib/api/rate";
import ReasonSelect from "components/select/reason";

const MarkNoShowForm = ({
    transactionInfo,
    reservation,
    additionalMutateUrl,
    customRerender,
}: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object().shape({
        ReasonID: yup.number().required("Сонгоно уу"),
        Fee: yup.number().required("Сонгоно уу"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm(formOptions);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            // values.NewRoomTypeID = roomType.RoomTypeID
            //     ? roomType.RoomTypeID
            //     : values.RoomTypeID;
            // values.NewRoomID = values.RoomID;
            // delete values.RoomTypeID;
            // delete values.RoomID;
            console.log("values", values);
            const res = await ReservationAPI.noShow(values);

            await mutate(listUrl);
            if (additionalMutateUrl) {
                await mutate(additionalMutateUrl);
            }
            toast(
                intl.formatMessage({
                    id: "TextSuccess",
                })
            );

            if (customRerender) {
                customRerender();
            }
            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="hidden"
                    {...register("TransactionID")}
                    value={transactionInfo.TransactionID}
                />

                <ReasonSelect
                    register={register}
                    errors={errors}
                    ReasonTypeID={2}
                    nameKey={"ReasonID"}
                />

                <TextField
                    fullWidth
                    id="Fee"
                    label={intl.formatMessage({
                        id: "TextCancellationFee",
                    })}
                    {...register("Fee")}
                    margin="dense"
                    error={errors.Fee?.message}
                    helperText={errors.Fee?.message}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <LoadingButton
                        size="small"
                        type="submit"
                        variant="contained"
                        loading={loading}
                        className="mt-3"
                    >
                        {intl.formatMessage({
                            id: "ButtonMarkNoShow",
                        })}
                    </LoadingButton>
                </div>
            </form>
        </>
    );
};

export default MarkNoShowForm;
