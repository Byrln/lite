import { TextField, MenuItem, Alert, Box, Skeleton } from "@mui/material";
import { useIntl } from "react-intl";
import { useState, useEffect, useContext } from "react";

import { AccountingAPI } from "lib/api/accounting";
import { ApiResponseModel } from "models/response/ApiResponseModel";

const AccountGroupSelect = ({
    register,
    errors,
    customRegisterName,
    AccountGroup,
    setAccountGroup,
    IsDebit,
}: any) => {
    const intl = useIntl();
    const [data, setData]: any = useState(null);

    useEffect(() => {
        const fetchDatas = async () => {
            const response = await AccountingAPI.accountGroup(IsDebit);
            if (response) {
                setData(response);
            } else {
                setData(null);
            }
        };
        fetchDatas();
    }, [IsDebit]);

    const onchange = (val: any) => {
        setAccountGroup(val);
    };

    return (
        <TextField
            fullWidth
            id={customRegisterName ? customRegisterName : "GroupID"}
            label={intl.formatMessage({
                id: "TextPaymentMethod",
            })}
            {...register(customRegisterName ? customRegisterName : "GroupID")}
            select
            margin="dense"
            size="small"
            value={AccountGroup}
            onChange={(evt: any) => {
                onchange(evt.target.value);
            }}
            error={
                errors[customRegisterName ? customRegisterName : "GroupID"] &&
                errors[customRegisterName ? customRegisterName : "GroupID"]
                    .message
            }
            helperText={
                errors[customRegisterName ? customRegisterName : "GroupID"] &&
                errors[customRegisterName ? customRegisterName : "GroupID"]
                    .message
            }
        >
            {data &&
                data.map((element: any) => (
                    <MenuItem key={element.GroupID} value={element.GroupID}>
                        {element.GroupName}
                    </MenuItem>
                ))}
        </TextField>
    );
};

export default AccountGroupSelect;
