import { TextField, Grid } from "@mui/material";

import ReasonTypeSelect from "components/select/reason-type";

const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <ReasonTypeSelect
                    register={register}
                    errors={errors}
                    label="Төрөл"
                />
            </Grid>
        </Grid>
    );
};

export default Search;
