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
    PayCurrencyID: yup.string().required("Бөглөнө үү"),
    Amount: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
});

const baseStayDefault = {
    TransactionID: 0,
};

const NewEdit = ({ TransactionID, FolioID, TypeID }: any) => {
    const [baseStay, setBaseStay]: any = useState(baseStayDefault);
    const [entity, setEntity]: any = useState({});

    const [paymentMethodGroupID, setPaymentMethodGroupID]: any = useState(0);
    const [paymentMethodID, setPaymentMethodID]: any = useState(0);

    const [state]: any = useAppState();
    const {
        register,
        reset,
        resetField,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleOnChange = (value: any) => {
        console.log("value", value);
        setPaymentMethodGroupID(value);
        mutate(paymentMethodUrl);
    };

    const customResetEvent = (data: any) => {
        console.log("formdata", data[0]);
        setEntity(data[0]);
        resetField(`Amount`, {
            defaultValue: data[0].Amount1,
        });
        resetField(`PayCurrencyID`, {
            defaultValue: data[0].CurrencyID,
        });

        setBaseStay({
            ...baseStay,
            CurrencyID: data[0].CurrencyID,
        });
    };

    const customSubmit = async (values: any) => {
        try {
            let tempValues = {
                TransactionID: entity.TransactionID,
                FolioID: entity.FolioID,
                TypeID: TypeID,
                ItemID: entity.ItemID,
                CurrDate: entity.CurrDate,
                PayCurrencyID: values.PayCurrencyID,
                Amount: values.Amount,
                Quantity: values.Quantity ? values.Quantity : entity.Quantity,
                Description: values.Description,
                RateModeID: entity.RateModeID,
                TaxIncluded: entity.TaxIncluded,
            };
            FolioAPI.update(tempValues);
        } finally {
        }
    };
    console.log("baseStay", entity);
    return (
        <NewEditForm
            api={FolioAPI}
            listUrl={"/api/Folio/Group/Details"}
            additionalValues={{
                FolioID: FolioID,
                TransactionID: TransactionID,
                ItemID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setBaseStay}
            customResetEvent={customResetEvent}
            customSubmit={customSubmit}
        >
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Controller
                            name="CurrDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label="Огноо"
                                    value={value}
                                    disabled={true}
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
                                            id="CurrDate"
                                            {...register("CurrDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.CurrDate?.message}
                                            helperText={
                                                errors.CurrDate?.message
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            size="small"
                            id="ItemName"
                            {...register("ItemName")}
                            margin="dense"
                            fullWidth
                            error={errors.ItemName?.message}
                            helperText={errors.ItemName?.message}
                            label={"Хэлбэр"}
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Description"
                            label="Description"
                            {...register("Description")}
                            margin="dense"
                            error={errors.Description?.message}
                            helperText={errors.Description?.message}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <CurrencySelect
                            register={register}
                            errors={errors}
                            nameKey={`PayCurrencyID`}
                            entity={baseStay}
                            setEntity={setBaseStay}
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            type="number"
                            fullWidth
                            id="Amount"
                            label="Дүн"
                            InputProps={{ inputProps: { min: 0 } }}
                            {...register("Amount")}
                            margin="dense"
                            size="small"
                            error={errors.Amount?.message}
                            helperText={errors.Amount?.message}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
