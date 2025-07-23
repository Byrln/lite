import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const RateModeSelect = ({
    register,
    errors,
    entity,
    setEntity,
    reset,
}: any) => {
    const data = [
        {
            RateModeID: 1,
            RateModeName: "Энгийн",
        },
        {
            RateModeID: 2,
            RateModeName: "Гараар",
        },
        {
            RateModeID: 3,
            RateModeName: "Гэрээт тариф",
        },
    ];

    const onChange = (event: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                RateModeID: event.target.value,
            });
        }
        if (reset) {
            reset({
                RateModeID: event.target.value,
            });
        }
    };

    return (
        <>
            <FormControl component="fieldset">
                {/* <FormLabel id="RateModeID">Rate Mode</FormLabel> */}
                <RadioGroup
                    row
                    id="RateModeID"
                    aria-label="Gender"
                    {...register("RateModeID")}
                    error={!!errors.RateModeID?.message}
                    helperText={errors.RateModeID?.message}
                    value={entity && entity.RateModeID}
                    onChange={onChange}
                    label="Rate Mode"
                >
                    {data.map((element: any, index: number) => (
                        <FormControlLabel
                            key={index}
                            value={element.RateModeID}
                            control={<Radio />}
                            label={element.RateModeName}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </>
    );
};

export default RateModeSelect;
