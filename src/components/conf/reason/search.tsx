import { TextField, Grid } from "@mui/material";
import { useIntl } from "react-intl";
import ReasonTypeSelect from "components/select/reason-type";

const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <ReasonTypeSelect
                    register={register}
                    errors={errors}
                    id="TextType"
                    label={intl.formatMessage({id:"TextType"}) }
                    {...register("TextType")}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
