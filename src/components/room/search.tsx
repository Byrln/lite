import { Grid } from "@mui/material";
import RoomTypeSelect from "components/select/room-type";
import { useIntl } from "react-intl";
const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <RoomTypeSelect 
                    register={register} 
                    errors={errors} 
                    customRegisterName="RoomTypeID"
                    isSearch={true}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
