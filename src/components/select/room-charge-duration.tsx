import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const RoomChargeDurationSelect = ({
    register,
    errors,
    entity,
    setEntity,
    reset,
}: any) => {
    const data = [
        {
            RoomChargeDurationID: 1,
            RoomChargeDurationName: "Daily",
        },
        {
            RoomChargeDurationID: 2,
            RoomChargeDurationName: "Weekly",
        },
        {
            RoomChargeDurationID: 3,
            RoomChargeDurationName: "Month",
        },
    ];

    const onChange = (evt: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                RoomChargeDurationID: evt.target.value,
            });
        }
        if (reset) {
            reset({
                RoomChargeDurationID: evt.target.value,
            });
        }
    };

    return (
        <>
            <FormControl component="fieldset">
                {/* <FormLabel id="RoomChargeDurationID">
                    Room Charge Duration
                </FormLabel> */}
                <RadioGroup
                    row
                    id="RoomChargeDurationID"
                    aria-label="Gender"
                    {...register("RoomChargeDurationID")}
                    error={!!errors.RoomChargeDurationID?.message}
                    helperText={errors.RoomChargeDurationID?.message}
                    value={entity && entity.RoomChargeDurationID}
                    onChange={onChange}
                >
                    {data.map((element: any, index: number) => (
                        <FormControlLabel
                            key={index}
                            value={element.RoomChargeDurationID}
                            control={<Radio />}
                            label={element.RoomChargeDurationName}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </>
    );
};

export default RoomChargeDurationSelect;
