import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import RoomSelect from "components/select/room";

const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <RoomSelect
                    register={register}
                    errors={errors}
                    baseStay={{
                        TransactionID: 0,
                        roomType: null,
                        dateStart: null,
                        dateEnd: null,
                        nights: 0,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
