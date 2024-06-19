import { Grid } from "@mui/material";

import CustomerGroupSelect from "components/select/customer-group";

const Search = ({ register, errors }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <CustomerGroupSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
