import { Controller, useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { mutate } from "swr";

import CustomSelect from "components/common/custom-select";
import NewEditForm from "components/common/new-edit-form";
import { FolioAPI, listUrl } from "lib/api/folio";
import RoomTypeSelect from "components/select/room-type";
import FloorSelect from "components/select/floor";
import { useAppState } from "lib/context/app";
import { dateStringToObj } from "lib/utils/helpers";
import PaymentMethodGroupSelect from "components/select/payment-method-group";
import PaymentMethodSelect from "components/select/payment-method";
import { listUrl as paymentMethodUrl } from "lib/api/payment-method";
import CurrencySelect from "components/select/currency";

const validationSchema = yup.object().shape({
    TypeID: yup.string().required("Бөглөнө үү"),
    CurrDate: yup.string().required("Бөглөнө үү"),
    PaymentMethodGroupID: yup.string().required("Бөглөнө үү"),
    PaymentMethodID: yup.string().required("Бөглөнө үү"),
    PayCurrencyID: yup.string().required("Бөглөнө үү"),
    Amount: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
});

const baseStayDefault = {
    TransactionID: 0,
};

const NewEdit = ({ TransactionID, FolioID }: any) => {
    const [baseStay, setBaseStay]: any = useState(baseStayDefault);
    const [paymentMethodGroupID, setPaymentMethodGroupID]: any = useState(0);
    const [paymentMethodID, setPaymentMethodID]: any = useState(0);

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

    const handleOnChange = (value: any) => {
        setPaymentMethodGroupID(value);
        mutate(paymentMethodUrl);
    };

    return (
        <NewEditForm
            api={FolioAPI}
            listUrl={listUrl}
            additionalValues={{
                FolioID: FolioID,
                TransactionID: TransactionID,
                ItemID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setBaseStay}
        >
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <CustomSelect
                            register={register}
                            errors={errors}
                            field="TypeID"
                            label="Төрөл"
                            options={[
                                { key: 1, value: "Тооцоо" },
                                { key: 2, value: "Төлбөр" },
                            ]}
                            optionValue="key"
                            optionLabel="value"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Controller
                            name="CurrDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label="Огноо"
                                    value={value}
                                    onChange={(value:any) =>
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
                                    renderInput={(params:any) => (
                                        <TextField
                                            size="small"
                                            id="CurrDate"
                                            {...register("CurrDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={!!errors.CurrDate?.message}
                                            helperText={
                                                errors.CurrDate?.message
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <PaymentMethodGroupSelect
                            register={register}
                            errors={errors}
                            onChange={handleOnChange}
                        />
                    </Grid>

                    {paymentMethodGroupID ? (
                        <Grid item xs={3}>
                            <PaymentMethodSelect
                                register={register}
                                errors={errors}
                                PaymentMethodGroupID={paymentMethodGroupID}
                                setPaymentMethodID={setPaymentMethodID}
                                PaymentMethodID={paymentMethodID}
                            />
                        </Grid>
                    ) : (
                        <></>
                    )}

                    <Grid item xs={3}>
                        <CurrencySelect
                            register={register}
                            errors={errors}
                            nameKey={`PayCurrencyID`}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            type="number"
                            fullWidth
                            id="Amount"
                            label="Дүн"
                            InputProps={{ inputProps: { min: 0 } }}
                            {...register("Amount")}
                            margin="dense"
                            size="small"
                            error={!!errors.Amount?.message}
                            helperText={errors.Amount?.message as string}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Description"
                            label="Description"
                            {...register("Description")}
                            margin="dense"
                            error={!!errors.Description?.message}
                            helperText={errors.Description?.message as string}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
