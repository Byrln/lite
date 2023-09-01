import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import RoomTypeSelect from "components/select/room-type";

const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <RoomTypeSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
