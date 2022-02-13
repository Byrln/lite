import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import { GuestAPI } from "lib/api/guest";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Box from "@mui/material/Box";

const SelectList = ({ filterValues, setGuest }: any) => {
    const [guestList, setGuestList]: any = useState([]);

    useEffect(() => {
        fetchDatas();
    }, [filterValues]);

    const fetchDatas = async () => {
        if (
            filterValues.GuestName.length > 3 ||
            filterValues.IdentityValue.length > 3 ||
            filterValues.Phone.length > 3
        ) {
            let response: ApiResponseModel = await GuestAPI.list(filterValues);
            console.log(response);
            if (response.status == 200) {
                console.log(response.data);
                setGuestList(response.data);
            }
        }
    };

    const guestSelect = (guestID: number) => {
        console.log(guestID);
    };

    return (
        <Box
            sx={{
                width: "90%",
                height: 400,
                maxHeight: 400,
                maxWidth: 600,
                bgcolor: "background.paper",
            }}
        >
            <List>
                {guestList.map((guest: any, index: number) => (
                    <ListItem
                        key={index}
                        disableGutters
                        secondaryAction={
                            <IconButton
                                onClick={() => {
                                    setGuest(guest);
                                }}
                            >
                                <ArrowCircleRightIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={`${guest.GuestFullName}`} />
                        <ListItemText primary={`${guest.IdentityValue}`} />
                        <ListItemText primary={`${guest.CountryName}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SelectList;
