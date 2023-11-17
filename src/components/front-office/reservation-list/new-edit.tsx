import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";

import NewEditForm from "components/common/new-edit-form";
import { ReservationAPI, listUrl } from "lib/api/reservation";
import { useAppState } from "lib/context/app";
import { dateStringToObj } from "lib/utils/helpers";
import NewForm from "./new-form";
const validationSchema = yup.object().shape({
    DeparturedListName: yup.string().notRequired(),
});

const NewEdit = () => {
    const [state]: any = useAppState();

    const {
        register,
        reset,
        handleSubmit,
        control,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            TransactionDetail: [{}],
        },
        resolver: yupResolver(validationSchema),
    });

    const { fields, append, remove, insert } = useFieldArray({
        control,
        name: "TransactionDetail",
    });
    return (
        <NewEditForm
            api={ReservationAPI}
            listUrl={listUrl}
            // additionalValues={{
            //     DeparturedListID: state.editId,
            // }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <LocalizationProvider // @ts-ignore
                    dateAdapter={AdapterDateFns}
                >
                    {fields.map((field, index) => (
                        <NewForm
                            id={index}
                            register={register}
                            control={control}
                            errors={errors}
                            getValues={getValues}
                        />
                    ))}
                </LocalizationProvider>
                <button
                    type="button"
                    //@ts-ignore
                    onClick={() => append(getValues(`TransactionDetail[0]`))}
                >
                    append
                </button>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
