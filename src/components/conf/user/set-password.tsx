import * as yup from "yup";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { UserAPI, listUrl } from "lib/api/user";

const validationSchema = yup.object().shape({
    Password: yup.string().required("Шинэ нууц үг бичнэ үү!"),
});

const NewEdit = ({ UserID }: any) => {
    const intl = useIntl();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const [reservation, setReservation]: any = useState(null);
    const [summary, setSummary]: any = useState(null);

    const customSubmit = async (values: any) => {
        try {
            await UserAPI.setPassword(values);
        } finally {
        }
    };

    return (
        <NewEditForm
            api={UserAPI}
            listUrl={listUrl}
            additionalValues={{
                UserID: UserID,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="TextPassword"
                        label={intl.formatMessage({id:"TextPassword"}) }
                        {...register("TextPassword")}
                margin="dense"
                error={errors.Password?.message}
                helperText={errors.Password?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
