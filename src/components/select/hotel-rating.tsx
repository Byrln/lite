import { TextField, MenuItem } from "@mui/material";
import { useIntl } from "react-intl";
import { Controller } from "react-hook-form";

const HotelRatingSelect = ({
    control,
    errors,
    sx,
    ...props
}: any) => {
    const intl = useIntl();

    const hotelRatings = [
        { HotelRatingID: 1, HotelRatingName: "1 Star" },
        { HotelRatingID: 2, HotelRatingName: "2 Stars" },
        { HotelRatingID: 3, HotelRatingName: "3 Stars" },
        { HotelRatingID: 4, HotelRatingName: "4 Stars" },
        { HotelRatingID: 5, HotelRatingName: "5 Stars" },
        { HotelRatingID: 6, HotelRatingName: "Boutique" },
        { HotelRatingID: 7, HotelRatingName: "Luxury" },
        { HotelRatingID: 8, HotelRatingName: "Budget" },
        { HotelRatingID: 9, HotelRatingName: "Business" },
        { HotelRatingID: 10, HotelRatingName: "Resort" }
    ];

    return (
        <Controller
            name="HotelRatingID"
            control={control}
            defaultValue=""
            render={({ field }) => (
                <TextField
                    {...field}
                    size="small"
                    fullWidth
                    select
                    id="HotelRatingID"
                    label={intl.formatMessage({ id: "HotelRating" })}
                    margin="dense"
                    error={!!errors.HotelRatingID?.message}
                    helperText={errors.HotelRatingID?.message as string}
                    sx={sx}
                    {...props}
                >
                    <MenuItem value="">
                        <em>Select Hotel Rating</em>
                    </MenuItem>
                    {hotelRatings.map((rating) => (
                        <MenuItem key={rating.HotelRatingID} value={rating.HotelRatingID}>
                            {rating.HotelRatingName}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
};

export default HotelRatingSelect;