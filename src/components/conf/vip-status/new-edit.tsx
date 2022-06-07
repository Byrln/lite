import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { VipStatusAPI, listUrl } from "lib/api/vip-status";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    VipStatusName: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <NewEditForm
            api={VipStatusAPI}
            listUrl={listUrl}
            additionalValues={{
                VipStatusID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="VipStatusName"
                label="Бүлгийн нэр"
                {...register("VipStatusName")}
                margin="dense"
                error={errors.VipStatusName?.message}
                helperText={errors.VipStatusName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
