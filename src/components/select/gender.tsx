import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller } from "react-hook-form";

import FormLabel from "@mui/material/FormLabel";
import { AnyObject } from "yup/lib/types";

const GenderSelect = ({
    register,
    errors,
    entity,
    setEntity,
    reset = null,
    control = null,
}: any) => {
    const data = [
        { GenderID: 1, name: "Эрэгтэй" },
        { GenderID: 2, name: "Эмэгтэй" },
    ];

    const onChange = (event: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                GenderID: Number(event.target.value),
            });
        }

        if (reset) {
            reset({
                GenderID: Number(event.target.value),
            });
        }
    };

    return (
        <>
            <Controller
                name="GenderID"
                defaultValue=""
                control={control ? control : null}
                render={({ field }: any) => (
                    <FormControl fullWidth>
                        <RadioGroup
                            {...field}
                            row
                            onChange={(event, value) => field.onChange(value)}
                            value={field.value}
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
                        <FormHelperText>
                            {String(errors["GenderID"]?.message ?? "")}
                        </FormHelperText>
                    </FormControl>
                )}
            />
        </>
    );
};

export default GenderSelect;
