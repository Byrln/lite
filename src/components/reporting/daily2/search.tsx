import { Grid } from "@mui/material";

import FloorSelect from "components/select/floor";

const Search = ({ register, errors }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <FloorSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
