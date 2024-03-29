import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import { FrontOfficeAPI } from "lib/api/front-office";
import axios from "lib/utils/axios";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useGetPaymentMethodGroupAPI } from "lib/api/payment-method-group";
import { useGetChargeTypeGroupAPI } from "lib/api/charge-type-group";
import { useGetChargeTypeAPI, ChargeTypeAPI } from "lib/api/charge-type";
import FolioCharge from "./charge";
import { FolioAPI } from "lib/api/folio";
import { mutate } from "swr";

export default function ChargeFormArray({
    FolioID,
    TransactionID,
    handleModal,
}: any) {
    const [workingDate, setWorkingDate] = useState(null);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
    };

    const [setedDate, setSetedDate] = useState<Date>(
        workingDate ? workingDate : new Datse()
    );

    const [enableDate, setEnableDate] = useState(true);

    const [chekedTrue, setChekedTrue] = useState(false);

    const handleChekbox = () => {
        if (chekedTrue == true) {
            setChekedTrue(false);
            setEnableDate(true);
        } else {
            setChekedTrue(true);
            setEnableDate(false);
        }
    };

    const FullDetail = Yup.object().shape({
        GroupID: Yup.string().notRequired(),
        ItemID: Yup.string().notRequired(),
        Amount: Yup.string().notRequired(),
        Quantity: Yup.string().notRequired(),
        Description: Yup.string().notRequired(),
    });

    const {
        register,
        reset,
        resetField,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            charge: [
                {
                    GroupID: null,
                    ItemID: null,
                    Amount: null,
                    Quantity: 1,
                    Description: " ",
                },
            ],
        },
        resolver: yupResolver(FullDetail),
    });

    const { fields, append, prepend, remove } = useFieldArray({
        control,
        name: "charge",
    });

    const onSubmit = async (data: any) => {
        for (const index in data.charge) {
            data.charge[index].TransactionID = TransactionID;
            data.charge[index].FolioID = FolioID;
            data.charge[index].TypeID = 1;
            await FolioAPI?.new(data.charge[index]);
        }
        await mutate(`/api/Folio/Items`);
        handleModal();
        console.log("data", data);
    };

    return (
        <div>
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Typography>Date</Typography>
                    <TextField
                        disabled
                        value={moment(workingDate).format("YYYY-MM-DD")}
                        fullWidth
                    />

                    <Typography>Date</Typography>

                    <Checkbox checked={chekedTrue} onChange={handleChekbox} />

                    <DateTimePicker
                        disabled={enableDate}
                        value={setedDate}
                        onChange={(newValue: any) => setSetedDate(newValue)}
                        renderInput={(params) => (
                            <TextField fullWidth {...params} />
                        )}
                    />
                </Stack>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field, index) => (
                        <>
                            <FolioCharge
                                id={index}
                                register={register}
                                remove={remove}
                                FolioID={FolioID}
                                TransactionID={TransactionID}
                                resetField={resetField}
                            />
                        </>
                    ))}
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Button
                            onClick={() => {
                                append({
                                    GroupID: null,
                                    ItemID: null,
                                    Amount: null,
                                    Quantity: 1,
                                    Description: " ",
                                });
                            }}
                        >
                            Add charge
                        </Button>
                    </Stack>

                    <Button type="submit">submit</Button>
                </form>
            </LocalizationProvider>
        </div>
    );
}
