import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { HouseKeepingAPI, listRoomUrl } from "lib/api/house-keeping";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    HouseStatusName: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <NewEditForm
            api={HouseKeepingAPI}
            listUrl={listRoomUrl}
            additionalValues={{
                HouseStatusID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        ></NewEditForm>
    );
};

export default NewEdit;
