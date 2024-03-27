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
import { AnyMxRecord } from "dns";

export default function FolioCharge({
    FolioID,
    TransactionID,
    register,
    remove,
    id,
    resetField,
}: any) {
    const { chargegroup } = useGetChargeTypeGroupAPI();

    const [groupPick, setGroupPick] = useState("");
    const [typePick, setTypePick] = useState("");
    const [filteredData, setFilteredData] = useState<any>({});

    const [quantity, setQuantity] = useState(1);

    const [newchargeType, setNewChargeType] = useState<any>(null);

    const handleChange = (event: SelectChangeEvent) => {
        setGroupPick(event.target.value as string);
        resetField(`charge.${id}.Groupid`, {
            defaultValue: event.target.value as string,
        });
    };

    const fetchTest = async () => {
        const chargetype = await ChargeTypeAPI.get(null, {
            RoomChargeTypeGroupID: groupPick,
        });

        setNewChargeType(chargetype);
        setTypePick("");
    };

    const [chekedTrue, setChekedTrue] = useState(false);

    const handleTypeChange = (event: SelectChangeEvent) => {
        setTypePick(event.target.value as string);
        resetField(`charge.${id}.ItemID`, {
            defaultValue: event.target.value as string,
        });

        // resetField(`charge.${id}.Amount`,{
        //     defaultValue: typePickFilter && typePickFilter[0] && typePickFilter[0].RoomChargeTypeRate
        // })

        // console.log(typePickFilter)
    };

    useEffect(() => {
        fetchTest();
    }, [groupPick]);

    useEffect(() => {
        if (typePick) {
            let tempfiltered = newchargeType?.filter(
                (obj: { RoomChargeTypeID: any }) =>
                    obj.RoomChargeTypeID == typePick
            );
            setFilteredData(tempfiltered);

            resetField(`charge.${id}.Amount`, {
                defaultValue:
                    tempfiltered &&
                    tempfiltered[0] &&
                    tempfiltered[0].RoomChargeTypeRate &&
                    tempfiltered[0].RoomChargeTypeRate,
            });
        }
    }, [typePick]);

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
                            {...register(`charge.${id}.GroupID`)}
                            onChange={handleChange}
                            fullWidth
                        >
                            {chargegroup?.map((element: any) => {
                                return (
                                    <MenuItem
                                        key={element.RoomChargeTypeGroupID}
                                        value={element.RoomChargeTypeGroupID}
                                    >
                                        {element.RoomChargeTypeGroupName}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {groupPick ? (
                            <Select
                                value={typePick}
                                {...register(`charge.${id}.ItemID`)}
                                onChange={handleTypeChange}
                                fullWidth
                            >
                                {newchargeType?.map((element: any) => {
                                    return (
                                        <MenuItem
                                            key={element.RoomChargeTypeID}
                                            value={element.RoomChargeTypeID}
                                        >
                                            {element.RoomChargeTypeName}
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
                                    <Typography>Price</Typography>

                                    <TextField
                                        disabled={
                                            filteredData &&
                                            filteredData[0] &&
                                            !filteredData[0].IsEditable
                                        }
                                        {...register(`charge.${id}.Amount`)}
                                        name={`charge.${id}.Amount`}
                                        fullWidth
                                    />
                                </Stack>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Typography>Quantity</Typography>

                                    <TextField
                                        fullWidth
                                        {...register(`charge.${id}.Quantity`)}
                                        name={`charge.${id}.Quantity`}
                                        onChange={(newvalue: any) =>
                                            setQuantity(newvalue)
                                        }
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
