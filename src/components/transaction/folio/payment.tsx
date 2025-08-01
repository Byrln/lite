import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import { useGetPaymentMethodGroupAPI } from "lib/api/payment-method-group";
import { PaymentMethodAPI } from "lib/api/payment-method";
import { CurrencySWR } from "lib/api/currency";

import Iconify from "components/iconify/iconify";

export default function FolioPayment({
    FolioID,
    TransactionID,
    register,
    remove,
    id,
    resetField,
}: any) {
    const { paymentgroup } = useGetPaymentMethodGroupAPI();

    const { data } = CurrencySWR();

    const exhcangechoice = data;

    const [groupPick, setGroupPick] = useState("");
    const [typePick, setTypePick] = useState("");

    const [exchangeRatePick, setExchangeRatePick] = useState("154");

    const [newchargeType, setNewChargeType] = useState<any>(null);

    const [chekedTrue, setChekedTrue] = useState(true);

    const handleChange = (event: SelectChangeEvent) => {
        setGroupPick(event.target.value as string);
        resetField(`payment.${id}.Groupid`, {
            defaultValue: event.target.value as string,
        });
        setChekedTrue(false);
    };

    const handleExchangePick = (event: SelectChangeEvent) => {
        setExchangeRatePick(event.target.value as string);
        resetField(`payment.${id}.PayCurrencyID`, {
            defaultValue: event.target.value as string,
        });
    };

    const fetchTest = async () => {
        const chargetype = await PaymentMethodAPI.get({
            PaymentMethodGroupID: groupPick,
        });

        let tempfiltered = chargetype?.filter(
            (obj: { PaymentMethodGroupID: any }) =>
                obj.PaymentMethodGroupID == groupPick
        );

        setNewChargeType(tempfiltered);

        setTypePick("");
    };

    const handleTypeChange = (event: SelectChangeEvent) => {
        setTypePick(event.target.value as string);
    };

    useEffect(() => {
        fetchTest();
    }, [groupPick]);

    return (
        <div>
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography fontSize={14} fontWeight={400}>
                            Төрөл
                        </Typography>
                        <Select
                            value={groupPick}
                            {...register(`payment.${id}.GroupID`)}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                        >
                            {paymentgroup?.map((element: any) => {
                                return (
                                    <MenuItem
                                        key={element.PaymentMethodGroupID}
                                        value={element.PaymentMethodGroupID}
                                    >
                                        {element.PaymentMethodGroupName}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography fontSize={14} fontWeight={400}>
                            Төлбөрийн хэрэгсэл
                        </Typography>
                        <Select
                            value={typePick}
                            {...register(`payment.${id}.ItemID`)}
                            onChange={handleTypeChange}
                            fullWidth
                            disabled={chekedTrue}
                            size="small"
                        >
                            {newchargeType?.map((element: any) => {
                                return (
                                    <MenuItem
                                        key={element.PaymentMethodID}
                                        value={element.PaymentMethodID}
                                    >
                                        {element.PaymentMethodName}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography fontSize={14} fontWeight={400}>
                            Валют
                        </Typography>

                        <Select
                            value={exchangeRatePick}
                            {...register(`payment.${id}.PayCurrencyID`)}
                            onChange={handleExchangePick}
                            fullWidth
                            size="small"
                        >
                            {exhcangechoice?.map((element: any) => {
                                return (
                                    <MenuItem
                                        key={element.CurrencyID}
                                        value={element.CurrencyID}
                                    >
                                        {element.CurrencyCode}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {" "}
                        <Typography fontSize={14} fontWeight={400}>
                            Төлөх дүн
                        </Typography>
                        <TextField
                            type="number"
                            min={0}
                            {...register(`payment.${id}.Amount`)}
                            name={`payment.${id}.Amount`}
                            fullWidth
                            size="small"
                            onFocus={(e) =>
                                e.target.addEventListener(
                                    "wheel",
                                    function (e) {
                                        e.preventDefault();
                                    },
                                    { passive: false }
                                )
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {" "}
                        <Typography>Тайлбар</Typography>
                        <TextField
                            fullWidth
                            {...register(`payment.${id}.Description`)}
                            name={`payment.${id}.Description`}
                            multiline
                            size="small"
                        />
                    </Grid>
                </Grid>

                {/* <Stack
                            direction="column"
                            spacing={1}
                            justifyContent="flex-end"
                        >
                            <Stack
                                borderRadius="4px"
                                border={1.5}
                                width="50px"
                                height="50px"
                                borderColor="#e0e0e0"
                                justifyContent="center"
                                alignItems="center"
                                onClick={() => remove(id)}
                                sx={{
                                    "&:hover": {
                                        borderColor: "#616161",
                                    },
                                }}
                            >
                                <Iconify icon="bi:trash3" height="24px" />
                            </Stack>
                        </Stack> */}

                <Divider />
            </LocalizationProvider>
        </div>
    );
}
