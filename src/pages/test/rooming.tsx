import "react-calendar-timeline/lib/Timeline.css";
import { useEffect, useState } from "react";
import { RoomTypeAPI } from "lib/api/room-type";
import { RoomAPI } from "lib/api/room";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import Grid from "@mui/material/Grid";

const Rooming = (props: any) => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        console.log("useEffect");
        createGroups();
    }, []);

    const createGroups = async () => {
        let response: ApiResponseModel = await RoomTypeAPI.list(null);
        if (response.status == 200) {
            setRoomTypes(response.data);
        }
        response = await RoomAPI.list(null);
        if (response.status == 200) {
            setRooms(response.data);
        }
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item lg={4}>
                    <h4>Room Types</h4>
                    <ul>
                        {roomTypes.map((roomType: any, index: number) => {
                            return <li key={index}>{roomType.RoomTypeName}</li>;
                        })}
                    </ul>
                </Grid>
                <Grid item lg={4}>
                    <h4>Rooms</h4>
                    <ul>
                        {rooms.map((room: any, index: any) => {
                            return (
                                <li
                                    key={index}
                                >{`${room.RoomTypeName} - ${room.RoomNo}`}</li>
                            );
                        })}
                    </ul>
                </Grid>
            </Grid>
        </>
    );
};

export default Rooming;
