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

export default function FolioCharge({ FolioID }: any) {
    const { register, control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            charge: [{ firstName: "", lastName: "" }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "charge",
    });

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

    const [setedDate, setSetedDate] = useState<Date>(new Date());

    const [enableDate, setEnableDate] = useState(true);

    const [chekedTrue, setChekedTrue] = useState(false);

    const { paymentgroup } = useGetPaymentMethodGroupAPI();

    console.log(paymentgroup);

    const handleChekbox = () => {
        if (chekedTrue == true) {
            setChekedTrue(false);
            setEnableDate(true);
        } else {
            setChekedTrue(true);
            setEnableDate(false);
        }
    };

    return (
        <div>
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Stack direction="column" spacing={1}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography>Date</Typography>
                        <TextField
                            disabled
                            value={moment(workingDate).format("YYYY-MM-DD")}
                        />

                        <Typography>Date</Typography>

                        <Checkbox
                            checked={chekedTrue}
                            onChange={handleChekbox}
                        />

                        <DateTimePicker
                            disabled={enableDate}
                            value={setedDate}
                            onChange={(newValue) =>
                                setSetedDate(newValue ? newValue : new Date())
                            }
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>
                    <Grid container>
                        <Grid></Grid>
                        <Grid></Grid>
                        <Grid></Grid>
                    </Grid>
                </Stack>
            </LocalizationProvider>
        </div>
    );
}
