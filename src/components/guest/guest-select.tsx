import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import SelectList from "components/guest/select-list";
import NewEdit from "./new-edit";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const GuestSelect = ({ guestSelected }: any) => {
    const [idEditing, setIdEditing]: any = useState(null);
    const [guestCurrent, setGuestCurrent]: any = useState(null);
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
        setGuestCurrent(guest);
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

            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="mt-3"
            >
                <div></div>

                <Button
                    variant="contained"
                    onClick={(evt: any) => {
                        if (typeof guestSelected == "function") {
                            guestSelected(guestCurrent);
                        }
                    }}
                    size="small"
                >
                    Continue <ArrowForwardIcon />
                </Button>
            </Grid>
        </>
    );
};

export default GuestSelect;
