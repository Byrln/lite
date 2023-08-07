import { TextField } from "@mui/material";

const Search = () => {
    return (
        <TextField
            size="small"
            fullWidth
            id="DeparturedListName"
            label="DeparturedListName"
            // {...register("DeparturedListName")}
            margin="dense"
            // error={errors.DeparturedListName?.message}
            // helperText={errors.DeparturedListName?.message}
        />
    );
};

export default Search;
