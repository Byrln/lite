import { TextField, MenuItem, Alert, Box, Skeleton } from "@mui/material";
import { useIntl } from "react-intl";

import { CurrencySWR } from "lib/api/currency";

const CurrencySelect = ({
    register,
    errors,
    entity,
    setEntity,
    nameKey,
    disabled = false,
    value,
    onChange,
}: any) => {
    const intl = useIntl();
    const { data, error } = CurrencySWR();

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <TextField
            fullWidth
            id="CurrencyID"
            label={intl.formatMessage({
                id: "TextCurrencyName",
            })}
            {...register(nameKey)}
            select
            disabled={disabled}
            margin="dense"
            error={errors[nameKey]?.message}
            helperText={errors[nameKey]?.message}
            value={
                value
                    ? value
                    : entity && entity.CurrencyID
                    ? entity.CurrencyID
                    : null
            }
            size="small"
            onChange={(evt: any) => {
                onChange
                    ? onChange(evt)
                    : setEntity &&
                      setEntity({
                          ...entity,
                          CurrencyID: evt.target.value,
                      });
            }}
        >
            {data.map((element: any) => {
                return (
                    <MenuItem key={nameKey} value={element.CurrencyID}>
                        {`${element.CurrencySymbol}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default CurrencySelect;
