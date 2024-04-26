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
    entity,
    onChange,
    isNA,
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
                onChange={(value) => onChange && onChange(value.target.value)}
            >
                <option
                    key={
                        entity &&
                        options[entity[field]] &&
                        options[entity[field]][optionValue]
                    }
                    value={
                        entity &&
                        options[entity[field]] &&
                        options[entity[field]][optionValue]
                    }
                >
                    {entity &&
                        options[entity[field]] &&
                        options[entity[field]][optionLabel]}
                </option>
                {isNA && (
                    <>
                        <option key={-1} value={-1}>
                            Бүгд
                        </option>
                        <option key={0} value={0}>
                            N/A
                        </option>
                    </>
                )}
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
