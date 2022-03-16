import {TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { RoomTypeAPI} from "lib/api/room-type";
import {useState, useEffect} from "react";

const RoomTypeSelect = ({register, errors, onRoomTypeChange, baseStay}: any) => {
    const [data, setData]: any = useState([]);

    const fetchRoomTypes = async () => {
        var values = {
            RoomTypeID: 0,
            SearchStr: "",
            EmptyRow: 0
        };
        var d = await RoomTypeAPI.list(values);
        setData(d);
    };

    const eventRoomTypeChange = (val: any) => {
        if (onRoomTypeChange) {
            var rt;
            var roomType = null;
            for (rt of data) {
                if (rt.RoomTypeID === val) {
                    roomType = rt;
                }
            }
            if (roomType) {
                onRoomTypeChange(roomType);
            }
        }
    };

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    useEffect(() => {
        if (data && data.length > 0 && baseStay?.roomType?.RoomTypeID) {
            eventRoomTypeChange(baseStay?.roomType?.RoomTypeID);
        }
    }, [data]);

    // if (error) return <Alert severity="error">{error.message}</Alert>;
    //
    // if (!error && !data)
    //     return (
    //         <Box sx={{width: "100%"}}>
    //             <Skeleton/>
    //             <Skeleton animation="wave"/>
    //         </Box>
    //     );

    return (
        <TextField
            fullWidth
            id="RoomTypeID"
            label="Өрөөний төрөл"
            {...register("RoomTypeID")}
            select
            margin="dense"
            error={errors.RoomTypeID?.message}
            helperText={errors.RoomTypeID?.message}
            onChange={(evt: any) => {
                eventRoomTypeChange(evt.target.value);
            }}
            value={baseStay?.roomType?.RoomTypeID}
        >
            {data.map((element: any) => (
                <MenuItem key={element.RoomTypeID} value={element.RoomTypeID}>
                    {element.RoomTypeName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default RoomTypeSelect;
