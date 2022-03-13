import {useState} from "react";
import {Button, TextField} from "@mui/material";

const GroupAdd = ({baseStay, addReservations}: any) => {
    const [addCount, setAddCount] = useState(1);

    const onCountChange = (evt: any) => {
        setAddCount(evt.target.value);
    }

    return (
        <>
            <TextField
                id="resCount"
                label="Count"
                type="number"
                margin="dense"
                value={addCount}
                onChange={onCountChange}
                sx={{maxWidth: "100px", mx: 2}}
            />
            <Button
                variant="contained"
                onClick={(evt: any) => {
                    addReservations(baseStay, addCount);
                }}
            >Add room</Button>
        </>
    );

};

export default GroupAdd;
