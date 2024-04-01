import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import NewEditForm from "components/common/new-edit-form";
import { CustomerGroupAPI } from "lib/api/customer-group";
import { useAppState } from "lib/context/app";
import GuestSelect from "components/select/guest-select";
import CountrySelect from "components/select/country";
import VipStatusSelect from "components/select/vip-status";
import { GuestAPI } from "lib/api/guest";
import { ReservationAPI } from "lib/api/reservation";

const validationSchema = yup.object().shape({
    GuestName: yup.string().required("Бөглөнө үү"),
});

const NewEdit = ({ TransactionID }: any) => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });
    const [selectedGuest, setSelectedGuest]: any = useState(null);
    const [country, setCountry]: any = useState(null);
    const [vip, setVip]: any = useState(null);

    const customSubmit = async (values: any) => {
        try {
            let tempGuestValues = {
                Name: values.Name ? values.Name : "",
                Surname: values.Surname ? values.Surname : "",
                CountryID: values.CountryID ? values.CountryID : "",
                Email: values.Email ? values.Email : "",
                Mobile: values.Mobile ? values.Mobile : "",
                RegistryNo: values.RegistryNo ? values.RegistryNo : "",
                VipStatusID: values.VipStatusID ? values.VipStatusID : "",
            };

            let sharerValues = {
                TransactionID: TransactionID,
                GuestID: selectedGuest.value ? selectedGuest.value : "",
            };
            if (selectedGuest.value == "createNew") {
                const response = await GuestAPI.new(tempGuestValues);
                sharerValues.GuestID = response.data.JsonData[0].GuestID
                    ? response.data.JsonData[0].GuestID
                    : selectedGuest.value;
            }
            await ReservationAPI.guestReplace(sharerValues);
        } finally {
            await mutate(`/api/FrontOffice/TransactionInfo`);
        }
    };

    return (
        <NewEditForm
            api={CustomerGroupAPI}
            listUrl={`/api/FrontOffice/TransactionInfo`}
            additionalValues={{
                CustomerGroupID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6} sm={3}>
                    <GuestSelect
                        register={register}
                        errors={errors}
                        customRegisterName={`GuestName`}
                        selectedGuest={selectedGuest}
                        setSelectedGuest={setSelectedGuest}
                    />
                </Grid>
                {selectedGuest &&
                (selectedGuest.value == null ||
                    selectedGuest.value == "" ||
                    selectedGuest.value == "createNew") ? (
                    <>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                size="small"
                                fullWidth
                                id="Name"
                                label="Нэр"
                                {...register(`Name`)}
                                margin="dense"
                            />
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <TextField
                                size="small"
                                fullWidth
                                id="Surname"
                                label="Овог"
                                {...register(`Surname`)}
                                margin="dense"
                            />
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <TextField
                                size="small"
                                fullWidth
                                id="Email"
                                label="Имэйл"
                                type="email"
                                {...register(`Email`)}
                                margin="dense"
                            />
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <TextField
                                size="small"
                                fullWidth
                                id="Mobile"
                                label="Гар утас"
                                {...register(`Mobile`)}
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <CountrySelect
                                register={register}
                                errors={errors}
                                entity={country}
                                setEntity={setCountry}
                                customRegisterName={`CountryID`}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <VipStatusSelect
                                register={register}
                                errors={errors}
                                entity={vip}
                                setEntity={setVip}
                                customRegisterName={`VipStatusID`}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                size="small"
                                fullWidth
                                id="RegistryNo"
                                label="Регистрийн дугаар"
                                {...register("RegistryNo")}
                                margin="dense"
                            />
                        </Grid>
                    </>
                ) : (
                    ""
                )}
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
