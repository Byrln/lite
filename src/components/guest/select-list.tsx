import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { GuestAPI } from "lib/api/guest";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const SelectList = ({ filterValues, setGuest, groupIndex }: any) => {
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
            if (response.status == 200) {
                setGuestList(response.data);
            }
        }
    };

    const guestSelect = (guestID: number) => {};

    return (
        <Box
            sx={{
                width: "100%",
                height: 100,
                maxHeight: 350,
                bgcolor: "background.paper",
                overflow: "scroll",
                paddingRight: "20px",
                marginBottom: "20px",
            }}
        >
            <List>
                {guestList.map((guest: any, index: number) => (
                    <ListItem
                        key={index}
                        disableGutters
                        divider
                        // secondaryAction={
                        //     <IconButton
                        //         onClick={() => {
                        //             setGuest(guest);
                        //         }}
                        //     >
                        //         <ArrowCircleRightIcon />
                        //     </IconButton>
                        // }
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" component="div">
                                    {guest.GuestFullName}
                                    {/* <ListItemText primary={`${guest.GuestFullName}`} /> */}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="subtitle2" component="div">
                                    {guest.IdentityValue}
                                    {/* <ListItemText primary={`${guest.GuestFullName}`} /> */}
                                </Typography>{" "}
                                <Typography variant="subtitle2" component="div">
                                    {guest.CountryName}
                                    {/* <ListItemText primary={`${guest.GuestFullName}`} /> */}
                                </Typography>
                                {/* <ListItemText primary={`${guest.IdentityValue}`} />
                            <ListItemText primary={`${guest.CountryName}`} /> */}
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton
                                    onClick={() => {
                                        if (groupIndex == null) {
                                            setGuest(guest);
                                        } else {
                                            let tempGuest = { ...guest };
                                            tempGuest.groupReservation = [];
                                            tempGuest.groupReservation[
                                                groupIndex
                                            ] = guest;
                                            setGuest(tempGuest, groupIndex);
                                        }
                                    }}
                                >
                                    <ArrowCircleRightIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SelectList;
