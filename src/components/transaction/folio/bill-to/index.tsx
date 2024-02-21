import { Controller, useForm } from "react-hook-form";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import NewEditForm from "components/common/new-edit-form";
import { FolioAPI, listUrl } from "lib/api/folio";
import FolioSelect from "components/select/folio";

const validationSchema = yup.object().shape({
    CheckRC: yup.string().notRequired(),
    CheckEC: yup.string().notRequired(),
});

const NewEdit = ({ TransactionID, FolioID, handleModal }: any) => {
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

    return (
        <NewEditForm
            api={FolioAPI}
            listUrl={listUrl}
            additionalValues={{ FolioID: FolioID }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Controller
                                name="Bill to Guest"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        key={`BillToGuest1`}
                                        {...register(`BillToGuest1`)}
                                        onChange={handleBillToGuest}
                                        value={entity}
                                    />
                                )}
                            />
                        }
                        label="Bill to Guest"
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Controller
                                name="Bill to Customer"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        key={`BillToGuest2`}
                                        {...register(`BillToGuest2`)}
                                        value={!entity}
                                    />
                                )}
                            />
                        }
                        label="Bill to Customer"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FolioSelect
                        register={register}
                        errors={errors}
                        TransactionID={TransactionID}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
