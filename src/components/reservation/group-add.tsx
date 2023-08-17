import { useState } from "react";
import { Button, TextField } from "@mui/material";

const GroupAdd = ({
    baseStay,
    baseGroupStay,
    addReservations,
    setBaseGroupStay,
}: any) => {
    const [addCount, setAddCount] = useState(0);

    const onCountChange = (evt: any) => {
        setAddCount(evt.target.value);
    };

    return (
        <>
            <TextField
                id="resCount"
                label="Count"
                type="number"
                margin="dense"
                value={addCount}
                onChange={onCountChange}
                sx={{ maxWidth: "100px", mx: 2 }}
                size="small"
                disabled
            />
            <Button
                variant="outlined"
                onClick={(evt: any) => {
                    addReservations();
                    // let tempStay = [...baseGroupStay];
                    // tempStay.push(baseStay);
                    // setBaseGroupStay(tempStay);
                }}
            >
                + Add room
            </Button>
        </>
    );
};

export default GroupAdd;
