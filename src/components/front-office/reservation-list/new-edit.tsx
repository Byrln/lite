import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Grid, Card, CardContent } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";

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
        resetField,
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

    const { fields, append, prepend, remove, insert } = useFieldArray({
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
            <LocalizationProvider // @ts-ignore
                dateAdapter={AdapterDateFns}
            >
                {fields.map((field, index) => (
                    <Card className="mb-3" key={index}>
                        <CardContent>
                            <NewForm
                                id={index}
                                register={register}
                                control={control}
                                errors={errors}
                                getValues={getValues}
                                resetField={resetField}
                                reset={reset}
                            />
                        </CardContent>
                        {index != 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row-reverse",
                                    paddingRight: "16px",
                                }}
                            >
                                <Tooltip title="Remove">
                                    <IconButton
                                        aria-label="close"
                                        onClick={() => remove(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Duplicate">
                                    <IconButton
                                        aria-label="close"
                                        onClick={() =>
                                            append(
                                                getValues(
                                                    //@ts-ignore
                                                    `TransactionDetail[${index}]`
                                                )
                                            )
                                        }
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )}
                    </Card>
                ))}
            </LocalizationProvider>
            <Button
                variant="outlined"
                //@ts-ignore
                onClick={() => append(getValues(`TransactionDetail[0]`))}
                style={{ width: "100%" }}
            >
                + Өрөө нэмэх
            </Button>
        </NewEditForm>
    );
};

export default NewEdit;
