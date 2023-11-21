/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { GuestAPI } from "lib/api/guest";
import MenuItem from "@mui/material/MenuItem";

import { RoomTypeAPI } from "lib/api/room-type";

const GuestSelect = ({
    register,
    errors,
    onRoomTypeChange,
    baseStay,
    customRegisterName,
    groupIndex,
    RoomTypeID,
    resetField,
    selectedGuest,
    setSelectedGuest,
    id,
}: any) => {
    const [guests, setGuests] = useState([]);
    const [inputValue, setInputValue] = useState("");

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
                }));
                setGuests(formattedGuests);
                console.log("guests", guests);
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

    const createNewOption = { label: "Create New", value: "createNew" };

    // Filter options manually based on the input value
    const filteredOptions = [createNewOption, ...guests].filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    const handleCountryChange = (event: any, newValue: any) => {
        console.log("newValue", newValue);
        if (newValue.value == "createNew") {
            setSelectedGuest(newValue);
            resetField(`TransactionDetail.${id}.GuestDetail.GuestName`, {
                defaultValue: newValue.label,
            });
            resetField(`TransactionDetail.${id}.GuestDetail.GuestID`, {
                defaultValue: null,
            });
            console.log("1111", newValue.value);
        } else {
            setSelectedGuest(newValue);
            resetField(`TransactionDetail.${id}.GuestDetail.GuestName`, {
                defaultValue: newValue.label,
            });
            resetField(`TransactionDetail.${id}.GuestDetail.GuestID`, {
                defaultValue: newValue.value,
            });
            console.log("2222", newValue.value);
        }
    };

    return (
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
                    label="Зочин"
                    variant="outlined"
                    {...register(
                        customRegisterName ? customRegisterName : "GuestName"
                    )}
                />
            )}
        />
    );
};

export default GuestSelect;
