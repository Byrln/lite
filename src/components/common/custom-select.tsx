import {
    FormControl,
    FormHelperText,
    InputLabel,
    NativeSelect,
    OutlinedInput,
} from "@mui/material";

const CustomSelect = ({
    register,
    errors,
    field,
    label,
    options,
    optionValue,
    optionLabel,
    dense = true,
}: any) => {
    return (
        <FormControl
            fullWidth
            variant="outlined"
            size="small"
            margin={`${dense && "dense"}`}
            {...register(field)}
            error={errors[field]?.message}
        >
            <InputLabel variant="outlined" htmlFor={field}>
                {label}
            </InputLabel>
            <NativeSelect
                input={<OutlinedInput label={label} />}
                inputProps={{
                    name: field,
                    id: field,
                }}
            >
                <option></option>
                {options.map((element: any) => (
                    <option
                        key={element[optionValue]}
                        value={element[optionValue]}
                    >
                        {element[optionLabel]}
                    </option>
                ))}
            </NativeSelect>
            {errors[field]?.message && (
                <FormHelperText error>{errors[field]?.message}</FormHelperText>
            )}
        </FormControl>
    );
};

export default CustomSelect;
