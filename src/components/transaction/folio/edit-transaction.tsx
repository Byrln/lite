import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { FolioItemEditSWR, FolioAPI } from "lib/api/folio";
import { FrontOfficeAPI } from "lib/api/front-office";
import { mutate } from "swr";

import { CurrencySWR } from "lib/api/currency";

export default function EditFolioTransaction({
    FolioID,
    CurrID,
    TypeID,
    handleModal,
    TransactionID,
}: any) {
    useEffect(() => {
        fetchDate();
    }, []);

    const { data } = CurrencySWR();

    const exhcangechoice = data;

    const [workingDate, setWorkingDate] = useState(null);

    const [setedDate, setSetedDate] = useState<Date>(new Date());

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

    const [quantity, setQuantity] = useState<any>(0);

    const [iName, setIName] = useState();

    const [tType, setTType] = useState<any>(0);

    const [amount, setAmount] = useState<any>(0);

    const [amount2, setAmount2] = useState<any>(0);

    const [currency, setCurrency] = useState<any>("");

    const [currencyID, setCurrencyID] = useState<any>("");

    const [currency2, setCurrency2] = useState<any>("");

    const [EditableRate, setEditableRate] = useState<any>("");

    const [description, setDescription] = useState<any>(" ");

    const fetchDate = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [FolioID, CurrID, TypeID]);

    const [useData, setUseData] = useState();


    const fetchDatas = async () => {
        let response = await FolioAPI.edits(FolioID, CurrID, TypeID);

        setIName(response[0].ItemName);

        setTType(response[0].TypeID);

        setCurrency(response[0].PayCurrencyCode);

        setCurrencyID(response[0].PayCurrencyID.toString());

        setCurrency2(response[0].CurrencyCode);

        setEditableRate(response[0].EditableRate);

        setUseData(response);
        if (response[0].Quantity == 0 && response) {
            setQuantity(1);
        } else {
            setQuantity(response[0].Quantity);
        }

        if (response[0].Amount1 > 0 && response) {
            setAmount(response[0].Amount1);
            setAmount2(response[0].Amount2);
        } else {
            if (response[0].Amount1 == 0) {
                setAmount(response[0].Amount1);
                setAmount2(response[0].Amount2);
            } else {
                setAmount(response[0].Amount1 * -1);
                setAmount2(response[0].Amount2 * -1);
            }
        }
    };

    const handleSubmit = async () => {
        await FolioAPI?.update({
            TransactionID: TransactionID,
            FolioID: FolioID,
            TypeID: tType,
            CurrID: CurrID,
            CurrDate: setedDate,
            PayCurrencyID: currencyID,
            Amount: amount,
            Quantity: quantity,
            Description: description,
        });
        await mutate(`/api/Folio/Items`);
        handleModal();
    };

    const handleExchangePick = (event: SelectChangeEvent) => {
        setCurrencyID(event.target.value as string);
    };

    return (
        <div>
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Stack
                    direction="column"
                    justifyContent="center"
                    width="100%"
                    spacing={2}
                >
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Typography>Date</Typography>
                        <Typography>{workingDate}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Typography>Name</Typography>
                        <Typography>{iName}</Typography>
                    </Stack>
                    {tType == 1 ? (
                        <div>
                            <Stack direction="row" spacing={3}>
                                <Typography>Quantity</Typography>

                                <TextField
                                    type="number"
                                    value={quantity}
                                    onChange={(newvalue: any) =>
                                        setQuantity(newvalue.target.value)
                                    }
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
                            </Stack>
                        </div>
                    ) : (
                        <div>
                            <Select
                                value={currencyID}
                                onChange={handleExchangePick}
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
                        </div>
                    )}

                    <Stack direction="row" spacing={3} alignItems="center">
                        <Typography>Amount</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                                type="number"
                                disabled={!EditableRate}
                                value={amount}
                                onChange={(newvalue: any) =>
                                    setAmount(newvalue.target.value)
                                }
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
                            {tType == 1 ? (
                                <div>
                                    <Typography>{currency}</Typography>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </Stack>
                        {amount == amount2 ? (
                            <div></div>
                        ) : (
                            <div>
                                <Typography>
                                    {amount2.toLocaleString()}
                                    {currency2}
                                </Typography>
                            </div>
                        )}
                    </Stack>

                    <TextField
                        value={description}
                        onChange={(newvalue: any) =>
                            setDescription(newvalue.target.value)
                        }
                        fullWidth
                        multiline
                        rows={3}
                    />

                    <Stack direction="row" alignItems="center" spacing={3}>
                        <Typography>Date</Typography>

                        <Checkbox
                            checked={chekedTrue}
                            onChange={handleChekbox}
                        />

                        <DateTimePicker
                            disabled={enableDate}
                            value={setedDate}
                            onChange={(newValue: any) => setSetedDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>

                    <Button onClick={handleSubmit}>Save</Button>
                </Stack>
            </LocalizationProvider>
        </div>
    );
}
