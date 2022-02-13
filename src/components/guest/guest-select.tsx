import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import SelectList from "components/guest/select-list";
import NewEdit from "./new-edit";

const GuestSelect = ({ guestSelected }: any) => {
    const [idEditing, setIdEditing]: any = useState(null);
    const [filterValues, setFilterValues]: any = useState({
        GuestID: 0,
        GuestName: "",
        CountryID: "0",
        IdentityValue: "",
        Phone: "",
        TransactionID: "",
        IsMainOnly: false,
    });

    const setGuest = (guest: any) => {
        setIdEditing(guest.GuestID);
        if (typeof guestSelected == "function") {
            guestSelected(guest);
        }
    };

    const onFilterValueChange = ({ key, value }: any) => {
        if (key == "GuestName") {
            setFilterValues({
                ...filterValues,
                GuestName: value,
            });
        }
        if (key == "IdentityValue") {
            setFilterValues({
                ...filterValues,
                IdentityValue: value,
            });
        }
        if (key == "Phone") {
            setFilterValues({
                ...filterValues,
                Phone: value,
            });
        }
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <SelectList
                        filterValues={filterValues}
                        setGuest={setGuest}
                    />
                </Grid>
                <Grid item xs={6}>
                    <NewEdit
                        onFilterValueChange={onFilterValueChange}
                        idEditing={idEditing}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default GuestSelect;
