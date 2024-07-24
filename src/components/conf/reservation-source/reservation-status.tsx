import { useState, useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    FormControlLabel,
    TextField,
    Grid,
    CircularProgress,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import {
    ReservationStatusSWR,
    ReservationSourceAPI,
} from "lib/api/reservation-source";
import { ModalContext } from "lib/context/modal";
import ReferenceSelect from "components/select/reference";
import SubmitButton from "components/common/submit-button";

const validationSchema = yup.object().shape({
    DefaultStatusID: yup.string().required("Бөглөнө үү"),
    PaidStatusID: yup.string().required("Бөглөнө үү"),
});

const ReservationStatus = ({ ChannelSourceID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [entity, setEntity] = useState<any>();
    const [search, setSearch] = useState({
        ChannelSourceID: ChannelSourceID,
    });

    const { data, error } = ReservationStatusSWR(search);

    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            await ReservationSourceAPI?.reservationStatus(
                ChannelSourceID,
                entity
            );

            reset();
        } catch (error) {
            setLoading(false);
            handleModal();
        } finally {
            setLoading(false);
            handleModal();
        }
    };

    useEffect(() => {
        if (data && data[0]) {
            console.log("data[0]", data[0]);
            reset(data[0]);
            setEntity(data[0]);
        }
    }, [data]);
    console.log(entity);
    return data && data[0] ? (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ReferenceSelect
                register={register}
                errors={errors}
                type="ReservationType"
                label="Үндсэн төлөв"
                optionValue="RoomStatusID"
                optionLabel="ReservationTypeName"
                customField="DefaultStatusID"
                entity={entity}
                setEntity={setEntity}
            />
            <ReferenceSelect
                register={register}
                errors={errors}
                type="ReservationType"
                label="Төлбөр төлсөн төлөв"
                optionValue="RoomStatusID"
                optionLabel="ReservationTypeName"
                customField="PaidStatusID"
                entity={entity}
                setEntity={setEntity}
            />

            <FormControlLabel
                control={
                    <Controller
                        name="Booking"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("AutoAssignRoom")}
                                checked={
                                    entity && entity.AutoAssignRoom == true
                                        ? true
                                        : false
                                }
                                onChange={(e) =>
                                    setEntity &&
                                    setEntity({
                                        ...entity,
                                        AutoAssignRoom: e.target.checked,
                                    })
                                }
                            />
                        )}
                    />
                }
                label="Өрөөг автоматаар оноох"
            />
            <SubmitButton loading={loading} />
        </form>
    ) : (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress color="info" />
        </Grid>
    );
};

export default ReservationStatus;
