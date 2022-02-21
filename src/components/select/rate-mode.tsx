import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const RateModeSelect = ({ register, errors, entity, setEntity }: any) => {
    const data = [
        {
            RateModeID: 1,
            RateModeName: "Normal",
        },
        {
            RateModeID: 2,
            RateModeName: "Manual",
        },
        {
            RateModeID: 3,
            RateModeName: "Contract",
        },
    ];

    const onChange = (event: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                RateModeID: event.target.value,
            });

            console.log(entity);
        }
    };

    return (
        <>
            <FormControl component="fieldset">
                <FormLabel id="RateModeID">Rate Mode</FormLabel>
                <RadioGroup
                    row
                    id="RateModeID"
                    aria-label="Gender"
                    {...register("RateModeID")}
                    error={errors.RateModeID?.message}
                    helperText={errors.RateModeID?.message}
                    value={entity && entity.RateModeID}
                    onChange={onChange}
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
