import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Checkbox from "@mui/material/Checkbox";

import { FrontOfficeAPI } from "lib/api/front-office";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useGetPaymentMethodGroupAPI } from "lib/api/payment-method-group";
import { useGetChargeTypeGroupAPI } from "lib/api/charge-type-group";
import { useGetChargeTypeAPI, ChargeTypeAPI } from "lib/api/charge-type";
import { PaymentMethodAPI } from "lib/api/payment-method";
import { AnyMxRecord } from "dns";
import { CurrencySWR, CurrenctAPI } from "lib/api/currency";

export default function FolioPayment({
    FolioID,
    TransactionID,
    register,
    remove,
    id,
    resetField,
}: any) {
    const { paymentgroup } = useGetPaymentMethodGroupAPI();

    const {data} =CurrencySWR();

    const exhcangechoice=data;


    

    const [groupPick, setGroupPick] = useState("");
    const [typePick, setTypePick] = useState("");
   
    const [exchangeRatePick, setExchangeRatePick]=useState("");



    const [newchargeType, setNewChargeType] = useState<any>(null);
    const [newechargeType, setNeweChargeType] = useState<any>(null);

    const handleChange = (event: SelectChangeEvent) => {
        setGroupPick(event.target.value as string);
        resetField(`payment.${id}.Groupid`, {
            defaultValue: event.target.value as string,
        });
    };

    const handleExchangePick = (event: SelectChangeEvent) => {
        setExchangeRatePick(event.target.value as string);
        resetField(`payment.${id}.PayCurrencyID`, {
            defaultValue: event.target.value as string,
        });
       
    }


    const fetchTest = async () => {
        const chargetype = await PaymentMethodAPI.get( {
            PaymentMethodGroupID: groupPick,
        });

        setNewChargeType(chargetype);
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
                <Stack direction="column" spacing={1} mb={1}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography>Type</Typography>

                        <Select
                            value={groupPick}
                            {...register(`payment.${id}.GroupID`)}
                            onChange={handleChange}
                            fullWidth
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
                        {groupPick ? (
                            <Select
                                value={typePick}
                                {...register(`payment.${id}.ItemID`)}
                                onChange={handleTypeChange}
                                fullWidth
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
                        ) : (
                            <div></div>
                        )}
                    </Stack>

                    {typePick ? (
                        <div>
                            <Stack direction="column" spacing={1}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Select value={exchangeRatePick} 
                                    {...register(`payment.${id}.PayCurrencyID`)}
                                    onChange={handleExchangePick} 
                                fullWidth>
                                    {
                                        exhcangechoice?.map((element:any)=>{
                                            return(
                                            <MenuItem 
                                            key={element.CurrencyID}
                                            value={element.CurrencyID}
                                            >
                                            {element.CurrencyCode}
                                            </MenuItem>);
                                        })
                                    }

                                    </Select>

                                    <Typography>Amount</Typography>

                                    <TextField
                                        {...register(`payment.${id}.Amount`)}
                                        name={`payment.${id}.Amount`}
                                        fullWidth
                                    />
                                </Stack>
                            </Stack>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </Stack>
            </LocalizationProvider>
        </div>
    );
}
