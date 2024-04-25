import { TextField, Grid } from "@mui/material";

import RoomTypeSelect from "components/select/room-type";
import FloorSelect from "components/select/floor";

const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <FloorSelect
                    register={register}
                    errors={errors}
                    customField="Floor"
                    isFloorIdIsValue={false}
                />
            </Grid>

            <Grid item xs={3}>
                <RoomTypeSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
