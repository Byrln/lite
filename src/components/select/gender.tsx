import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

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

            console.log(entity);
        }
    };

    return (
        <>
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    id="GenderID"
                    aria-label="Gender"
                    {...register("GenderID")}
                    error={errors.GenderID?.message}
                    helperText={errors.GenderID?.message}
                    value={entity && entity.GenderID}
                    onChange={onChange}
                >
                    {data.map((element: any, index: number) => (
                        <FormControlLabel
                            key={index}
                            value={element.GenderID}
                            control={<Radio />}
                            label={element.name}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </>
    );
};

export default GenderSelect;
