import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, Button, IconButton, Tooltip } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import NewEditForm from "components/common/new-edit-form";
import { ReservationAPI, listUrl } from "lib/api/reservation";
import NewForm from "./new-form";

const validationSchema = yup.object().shape({
    DeparturedListName: yup.string().notRequired(),
});

const NewEdit = ({
    dateStart,
    dateEnd,
    roomType,
    room,
    BaseAdult,
    BaseChild,
    MaxAdult,
    MaxChild,
    workingDate,
}: any) => {
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
            TransactionDetail: [
                dateStart && dateEnd && roomType && room
                    ? {
                          ArrivalDate: dateStart,
                          DepartureDate: dateEnd,
                          RoomTypeID: roomType,
                          RoomID: room,
                          ReservationTypeID: 1,
                      }
                    : {},
            ],
        },
        resolver: yupResolver(validationSchema),
    });

    const { fields, append, prepend, remove, insert } = useFieldArray({
        control,
        name: "TransactionDetail",
    });

    const customResetEvent = (data: any) => {
        reset({
            TransactionDetail: [data],
        });
    };

    return (
        <NewEditForm
            api={ReservationAPI}
            listUrl={listUrl}
            reset={reset}
            handleSubmit={handleSubmit}
            customResetEvent={customResetEvent}
            additionalButtons={
                <Button
                    variant="outlined"
                    //@ts-ignore
                    onClick={() => append(getValues(`TransactionDetail[0]`))}
                    size="small"
                    className="mt-3 mr-3"
                >
                    + Өрөө нэмэх
                </Button>
            }
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
                                field={field}
                                BaseAdult={BaseAdult}
                                BaseChild={BaseChild}
                                MaxAdult={MaxAdult}
                                MaxChild={MaxChild}
                                workingDate={workingDate}
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
        </NewEditForm>
    );
};

export default NewEdit;
