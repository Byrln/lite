import { Controller, useForm } from "react-hook-form";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import NewEditForm from "components/common/new-edit-form";
import { FolioSWR, FolioAPI, listUrl } from "lib/api/folio";
import FolioSelect from "components/select/folio";

const validationSchema = yup.object().shape({
    CheckRC: yup.string().notRequired(),
    CheckEC: yup.string().notRequired(),
});

const NewEdit = ({ TransactionID, FolioID, handleModal }: any) => {
    const { data, error } = FolioSWR(TransactionID);
    const [entity, setEntity]: any = useState(null);

    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
        resetField,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const customSubmit = async (values: any) => {
        try {
            FolioAPI.cut(values);
            handleModal();
        } finally {
            handleModal();
        }
    };

    const handleBillToGuest = (e: any) => {
        // @ts-ignore

        console.log("testestses", e.target.checked);
        setEntity(e.target.checked);
        resetField(`BillToGuest1`, {
            defaultValue: e.target.checked,
        });
        resetField(`BillToGuest2`, {
            defaultValue: e.target.checked == true ? false : true,
        });
        // const changedPermissions = permissions.map((permission) => {
        //     permission.Status = e.target.checked;
        //     return permission;
        // });
        // setPermissions(changedPermissions);
    };

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <FolioSelect
                    register={register}
                    errors={errors}
                    TransactionID={TransactionID}
                />
            </Grid>
            <Grid item xs={6}>
                <FolioSelect
                    register={register}
                    errors={errors}
                    TransactionID={""}
                    customField="testShuu"
                />
            </Grid>
        </Grid>
    );
};

export default NewEdit;
