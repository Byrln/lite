import { Grid } from "@mui/material";

import ChargeTypeGroupSelect from "components/select/charge-type-group";

const Search = ({ register, errors }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <ChargeTypeGroupSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
