/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
    TextField,
    Autocomplete,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Stack,
    Button,
} from "@mui/material";
import { GuestAPI } from "lib/api/guest";
import InfoIcon from "@mui/icons-material/Info";
import { useIntl } from "react-intl";

const GuestSelect = ({
    register,

    customRegisterName,

    resetField,
    selectedGuest,
    setSelectedGuest,
    id,
    customError,
    customHelperText,
}: any) => {
    const [guests, setGuests] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const [vipName, setVipName] = useState(null);
    const intl = useIntl();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        // Fetch countries data from the API based on the input value
        const fetchGuests = async () => {
            try {
                var guests: any = await GuestAPI.list({
                    GuestName: inputValue,
                });
                // Transform the data to the format expected by Autocomplete
                const formattedGuests = guests.data.map((guest: any) => ({
                    label: guest.GuestFullName
                        ? guest.GuestFullName
                        : guest.Name,
                    value: guest.GuestID,
                    VipStatusName: guest.VipStatusName,
                }));
                setGuests(formattedGuests);
            } catch (error) {
                console.error("Error fetching guests:", error);
            }
        };

        // Only fetch countries if there is an input value
        if (inputValue.trim() !== "") {
            fetchGuests();
        } else {
            // Clear countries when input value is empty
            setGuests([]);
            localStorage.removeItem("guests");
        }
    }, [inputValue]);

    const createNewOption = {
        label: intl.formatMessage({
            id: "TextCreateNew",
        }),
        value: "createNew",
    };

    // Filter options manually based on the input value
    const filteredOptions = [createNewOption, ...guests].filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    const handleCountryChange = (event: any, newValue: any) => {
        if (newValue && newValue.value && newValue.value == "createNew") {
            setSelectedGuest(newValue);

            if (resetField) {
                resetField(`TransactionDetail.${id}.GuestDetail.GuestName`, {
                    defaultValue: "",
                });
                resetField(`TransactionDetail.${id}.GuestID`, {
                    defaultValue: null,
                });
            }
        } else {
            setSelectedGuest(newValue);
            if (resetField) {
                resetField(`TransactionDetail.${id}.GuestDetail.GuestName`, {
                    defaultValue:
                        newValue && newValue.label ? newValue.label : "",
                });
                resetField(`TransactionDetail.${id}.GuestID`, {
                    defaultValue:
                        newValue && newValue.value ? newValue.value : "",
                });
            }

            if (
                newValue &&
                newValue.VipStatusName != null &&
                newValue.VipStatusName != ""
            ) {
                setVipName(newValue.VipStatusName);
                handleClickOpen();
            }
        }
    };

    return (
        <>
            <Autocomplete
                className="mt-2"
                size="small"
                options={[createNewOption, ...guests]}
                getOptionLabel={(option: any) => option.label}
                value={selectedGuest}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) =>
                    setInputValue(newInputValue)
                }
                onChange={handleCountryChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={intl.formatMessage({
                            id: "TextGuest",
                        })}
                        variant="outlined"
                        error={customError}
                        helperText={customHelperText}
                        {...register(
                            customRegisterName
                                ? customRegisterName
                                : "GuestName"
                        )}
                    />
                )}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {/*<DialogTitle id="alert-dialog-title" className=""></DialogTitle>*/}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Stack direction="column" gap={1}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <InfoIcon />
                                <Typography variant="h6">VIP зочин</Typography>
                            </Stack>

                            <Typography variant="caption">{vipName}</Typography>
                            <Typography variant="caption">
                                Үйлчилгээндээ анхаарна уу!
                            </Typography>
                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GuestSelect;
