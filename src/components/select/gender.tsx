import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const GenderSelect = ({ register, errors, entity, setEntity }: any) => {
    const data = [
        { GenderID: 1, name: "Male" },
        { GenderID: 2, name: "Female" },
    ];

    const onChange = (event: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                GenderID: event.target.value,
            });
        }
    };

    return (
        <TextField
            fullWidth
            id="GenderID"
            label="Хүйс сонгох"
            {...register("GenderID")}
            select
            margin="dense"
            error={errors.GenderID?.message}
            helperText={errors.GenderID?.message}
            onChange={onChange}
        >
            {data.map((element: any) => (
                <MenuItem key={element.GenderID} value={element.GenderID}>
                    {element.name}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default GenderSelect;
