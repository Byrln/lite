import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import * as React from "react";

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
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import { useGetPaymentMethodGroupAPI } from "lib/api/payment-method-group";
import { useGetChargeTypeGroupAPI } from "lib/api/charge-type-group";
import { useGetChargeTypeAPI, ChargeTypeAPI } from "lib/api/charge-type";
import FolioCharge from "./charge";
import { FolioAPI } from "lib/api/folio";
import { mutate } from "swr";
import FolioPayment from "./payment";
import { CurrenctAPI } from "lib/api/currency";

import PaymentCustomTableData from "./payment-custom-table";

export default function PaymentFormArray({
    FolioID,
    TransactionID,
    handleModal,
    Amount,
}: any) {
    const [workingDate, setWorkingDate] = useState(null);
    const [newGroupCount, setNewGroupCount]: any = useState(1);

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
        workingDate ? workingDate : new Date()
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
        PayCurrencyID: Yup.string().notRequired(),
        ExchangeRate: Yup.string().notRequired(),
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
            payment: [
                {
                    GroupID: null,
                    ItemID: null,
                    Amount: Amount ? Amount : null,
                    Quantity: 1,
                    Description: " ",
                    PayCurrencyID: null,
                },
            ],
        },
        resolver: yupResolver(FullDetail),
    });

    const { fields, append, prepend, remove } = useFieldArray({
        control,
        name: "payment",
    });

    const onSubmit = async (data: any) => {
        for (const index in data.payment) {
            const exchangeRate = await CurrenctAPI.exchangeRate({
                CurrencyID: data.payment[index].PayCurrencyID,
            });
            data.payment[index].TransactionID = TransactionID;
            data.payment[index].FolioID = FolioID;
            data.payment[index].TypeID = 2;

            await FolioAPI?.new(data.payment[index]);
        }
        await mutate(`/api/Folio/Items`);
        handleModal();
    };

    const CustomWidthTooltip = styled(
        ({ className, ...props }: TooltipProps) => (
            <Tooltip {...props} classes={{ popper: className }} />
        )
    )({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 500,
            maxHeight: 400,
            background: "white",
            border: "rgba(0, 0, 0, .2) 1px solid",
            overflow: "scroll",
        },
    });

    return (
        <div>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                    flexDirection: "row-reverse",
                }}
                className="mb-1"
            >
                <CustomWidthTooltip
                    title={
                        <React.Fragment>
                            <div>
                                <PaymentCustomTableData FolioID={FolioID} />
                            </div>
                        </React.Fragment>
                    }
                >
                    <Button>Нийт төлбөр</Button>
                </CustomWidthTooltip>
            </Box>
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12} lg={12} className="mb-3">
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6} lg={6}>
                                <Typography fontSize="14px" fontWeight={400}>
                                    Date
                                </Typography>

                                <DateTimePicker
                                    disabled={enableDate}
                                    value={setedDate}
                                    onChange={(newValue: any) =>
                                        setSetedDate(newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            {...params}
                                            sx={{
                                                fontSize: "16px",
                                                fontWeight: 400,
                                                width: "100%",
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <div
                                    style={{ display: "flex" }}
                                    className="mt-3"
                                >
                                    <Checkbox
                                        checked={chekedTrue}
                                        onChange={handleChekbox}
                                        size="small"
                                        sx={{
                                            "& .MuiSvgIcon-root": {
                                                fontSize: 16,
                                            },
                                        }}
                                    />
                                    <Typography
                                        fontSize="12px"
                                        className="mt-2"
                                        fontWeight={400}
                                    >
                                        Огноо өөрчлөх
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box overflow="auto">
                                {fields.map((field, index) => (
                                    <>
                                        <FolioPayment
                                            id={index}
                                            register={register}
                                            remove={remove}
                                            FolioID={FolioID}
                                            TransactionID={TransactionID}
                                            resetField={resetField}
                                        />
                                    </>
                                ))}
                            </Box>

                            {/* <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="flex-end"
                                    spacing={0}
                                >
                                    <TextField
                                        type="number"
                                        margin="dense"
                                        size="small"
                                        style={{
                                            width: "40px",
                                        }}
                                        value={newGroupCount}
                                        onChange={(e: any) => {
                                            setNewGroupCount(e.target.value);
                                        }}
                                    />

                                    <Button
                                        onClick={() => {
                                            // append({
                                            //     GroupID: null,
                                            //     ItemID: null,
                                            //     Amount: null,
                                            //     Quantity: 1,
                                            //     Description: " ",
                                            // });
                                            for (
                                                let i = 0;
                                                i < newGroupCount;
                                                i++
                                            ) {
                                                append({
                                                    GroupID: null,
                                                    ItemID: null,
                                                    Amount: null,
                                                    Quantity: 1,
                                                    Description: " ",
                                                    PayCurrencyID: null,
                                                });
                                            }
                                            setNewGroupCount(1);
                                        }}
                                    >
                                        <Typography
                                            fontSize={20}
                                            fontWeight={700}
                                        >
                                            +
                                        </Typography>
                                    </Button>
                                </Stack> */}

                            <Stack alignItems="flex-end" mt={1}>
                                <Button variant="contained" type="submit">
                                    Хадгалах
                                </Button>
                            </Stack>
                        </form>
                    </Grid>
                    {/* <Grid item xs={12} md={12} lg={12}>
                        <PaymentCustomTableData FolioID={FolioID} />
                    </Grid> */}
                </Grid>
            </LocalizationProvider>
        </div>
    );
}
