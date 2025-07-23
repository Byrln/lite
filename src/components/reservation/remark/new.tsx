import { useState } from "react";
import { TextField } from "@mui/material";
import { useIntl } from "react-intl";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { mutate } from "swr";

import {
    listUrl,
    ReservationRemarkAPI,
} from "../../../lib/api/reservation-remark";

const RemarkNew = ({ TransactionID, setEditMode }: any) => {
    const intl = useIntl();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            let res = await ReservationRemarkAPI.new(values);
            await mutate(listUrl);

            setEditMode(false);

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const validationSchema = yup.object().shape({
        TransactionID: yup.number().required("Бөглөнө үү"),
        Remarks: yup.string().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                type={"hidden"}
                value={TransactionID}
                {...register("TransactionID")}
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 5,
                    alignItems: "center",
                }}
            >
                <div style={{ flexGrow: "1" }}>
                    <TextField
                        id={"Remarks"}
                        label={intl.formatMessage({
                            id: "TextHeaderRemarks",
                        })}
                        size="small"
                        {...register("Remarks")}
                        error={!!errors.Remarks?.message}
                        fullWidth
                    />
                </div>
                <div>
                    <IconButton type="submit" color="primary">
                        <SendIcon />
                    </IconButton>
                </div>
            </div>
        </form>
    );
};

export default RemarkNew;
