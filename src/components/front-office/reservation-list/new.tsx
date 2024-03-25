import { useForm, useFieldArray } from "react-hook-form";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { mutate } from "swr";

import ReservationSourceSelect from "components/select/reservation-source";
import {
    Card,
    CardContent,
    Button,
    Grid,
    TextField,
    Typography,
    Divider,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import moment from "moment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { ReservationTypeSelect } from "components/select";
import NewEditForm from "components/common/new-edit-form";
import { ReservationAPI } from "lib/api/reservation";
import { listUrl } from "lib/api/front-office";
import { dateStringToObj } from "lib/utils/helpers";
import PaymentMethodSelect from "components/select/payment-method";
import CurrencySelect from "components/select/currency";
import RoomTypeSelect from "components/select/room-type";
import { formatPrice } from "lib/utils/helpers";
import { countNights } from "lib/utils/format-time";
import ReferenceSelect from "components/select/reference";
import NewForm from "./new-form";
import CustomerGroupSelect from "components/select/customer-group";
import CustomerSelect from "components/select/customer";

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
    const [CustomerID, setCustomerID]: any = useState(0);
    const [ArrivalDate, setArrivalDate]: any = useState(
        dateStart && dateEnd && roomType && room ? dateStart : workingDate
    );
    const [DepartureDate, setDepartureDate]: any = useState(
        dateStart && dateEnd && roomType && room
            ? dateEnd
            : moment(dateStringToObj(workingDate)).add(1, "days").startOf("day")
    );
    const [BreakfastIncluded, setBreakfastIncluded]: any = useState("");
    const [TaxIncluded, setTaxIncluded]: any = useState("");
    const [ReservationSourceChecked, setReservationSourceChecked]: any =
        useState(false);

    const [selectedGuest, setSelectedGuest]: any = useState(null);
    const [ReservationTypeID, setReservationTypeID]: any = useState(1);
    const [newGroupCount, setNewGroupCount]: any = useState(1);
    const [newRoomTypeID, setNewRoomTypeID]: any = useState<any>(null);
    const [nights, setNights]: any = useState<any>(1);
    const [totalAmount, setTotalAmount]: any = useState<any>(0);
    const [billingInfo, setBillingInfo]: any = useState<any>(null);

    const setRange = (dateStart: Date, dateEnd: Date) => {
        var nights: number;
        nights = countNights(dateStart, dateEnd);
        setNights(nights);
    };

    useEffect(() => {
        if (ArrivalDate && DepartureDate) {
            setRange(ArrivalDate, DepartureDate);
        }
    }, [ArrivalDate, DepartureDate]);

    const [PaymentMethodID, setPaymentMethodID]: any = useState(null);
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
            ReservationSourceChecked: null,
            TaxIncluded: null,
            BreakfastIncluded: null,
            PayAmount: null,
            ArrivalDate:
                dateStart && dateEnd && roomType && room
                    ? dateStart
                    : workingDate,
            DepartureDate:
                dateStart && dateEnd && roomType && room
                    ? dateEnd
                    : moment(
                          dateStringToObj(
                              moment(workingDate).format("YYYY-MM-DD")
                          ),
                          "YYYY-MM-DD"
                      )
                          .add(1, "days")
                          .format("YYYY-MM-DD"),
            TransactionDetail: [
                dateStart && dateEnd && roomType && room
                    ? {
                          ArrivalDate: dateStart,
                          DepartureDate: dateEnd,
                          RoomTypeID: roomType,
                          RoomID: room,
                          ReservationTypeID: 1,
                          GuestDetail: {
                              Name: null,
                              Email: null,
                              Mobile: null,
                          },
                      }
                    : {
                          ArrivalDate: workingDate,
                          DepartureDate: moment(
                              dateStringToObj(
                                  moment(workingDate).format("YYYY-MM-DD")
                              ),
                              "YYYY-MM-DD"
                          )
                              .add(1, "days")
                              .format("YYYY-MM-DD"),
                          GuestDetail: {
                              Name: null,
                              Email: null,
                              Mobile: null,
                          },
                      },
            ],
        },
        resolver: yupResolver(validationSchema),
    });

    const { fields, append, prepend, remove, insert } = useFieldArray({
        control,
        name: "TransactionDetail",
    });

    useEffect(() => {
        if (getValues() && getValues().TransactionDetail) {
            setTotalAmount(
                getValues().TransactionDetail.reduce(
                    (acc: any, obj: any) =>
                        acc + (obj.CurrencyAmount ? obj.CurrencyAmount : 0),
                    0
                )
            );
        }
    }, [getValues()]);

    const customResetEvent = (data: any) => {
        reset({
            TransactionDetail: [data],
        });
    };

    const customSubmit = async (values: any) => {
        try {
            let tempValues = { ...values };
            tempValues.TransactionDetail[0].PayAmount = values.PayAmount;
            tempValues.TransactionDetail[0].PayCurrencyID =
                values.PayCurrencyID;
            tempValues.TransactionDetail[0].PaymentMethodID =
                values.PaymentMethodID;
            tempValues.TransactionDetail[0].ReservationSourceID =
                values.ReservationSourceID;
            tempValues.TransactionDetail[0].CustomerID = values.CustomerID;

            values.TransactionDetail.forEach((detail: any, index: any) => {
                tempValues.TransactionDetail[index].TaxIncluded = TaxIncluded;
                tempValues.TransactionDetail[index].BreakfastIncluded =
                    BreakfastIncluded;
                tempValues.TransactionDetail[index].ReservationTypeID =
                    values.ReservationTypeID;
                tempValues.TransactionDetail[index].ReservationSourceID =
                    values.ReservationSourceID;
                tempValues.TransactionDetail[index].ArrivalDate =
                    values.ArrivalDate;
                tempValues.TransactionDetail[index].DepartureDate =
                    values.DepartureDate;
                tempValues.TransactionDetail[index].CustomerID =
                    values.CustomerID;
            });

            await ReservationAPI.new(tempValues);
            await mutate("/api/RoomType/List");
            await mutate("/api/FrontOffice/StayView2");
            await mutate("/api/FrontOffice/ReservationDetailsByDate");
        } finally {
        }
    };

    return (
        <NewEditForm
            api={ReservationAPI}
            listUrl={listUrl}
            reset={reset}
            handleSubmit={handleSubmit}
            customResetEvent={customResetEvent}
            customSubmitTitle="Захиалах"
            customSubmit={customSubmit}
        >
            <LocalizationProvider // @ts-ignore
                dateAdapter={AdapterDateFns}
            >
                <Card className="mb-3">
                    <CardContent>
                        <Grid key="General" container spacing={1}>
                            <Grid item sm={6} xs={6}>
                                <Controller
                                    name={`ArrivalDate`}
                                    control={control}
                                    defaultValue={null}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <DatePicker
                                            label="Эхлэх огноо"
                                            value={value}
                                            minDate={new Date(workingDate)}
                                            onChange={(value) => (
                                                onChange(
                                                    moment(value, "YYYY-MM-DD")

                                                    // moment(
                                                    //     dateStringToObj(
                                                    //         moment(
                                                    //             value
                                                    //         ).format(
                                                    //             "YYYY-MM-DD"
                                                    //         )
                                                    //     ),
                                                    //     "YYYY-MM-DD"
                                                    // )
                                                ),
                                                setArrivalDate(
                                                    moment(value, "YYYY-MM-DD")

                                                    // moment(
                                                    //     dateStringToObj(
                                                    //         moment(
                                                    //             value
                                                    //         ).format(
                                                    //             "YYYY-MM-DD"
                                                    //         )
                                                    //     ),
                                                    //     "YYYY-MM-DD"
                                                    // ).format("YYYY-MM-DD")
                                                )
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    size="small"
                                                    id={`ArrivalDate`}
                                                    {...register(`ArrivalDate`)}
                                                    margin="dense"
                                                    fullWidth
                                                    {...params}
                                                    error={
                                                        errors.ArrivalDate
                                                            ?.message
                                                    }
                                                    helperText={
                                                        errors.ArrivalDate
                                                            ?.message
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item sm={6} xs={6}>
                                <Controller
                                    name={`DepartureDate`}
                                    control={control}
                                    defaultValue={null}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <DatePicker
                                            label="Гарах огноо"
                                            value={value}
                                            minDate={new Date(workingDate)}
                                            onChange={(value) => (
                                                onChange(
                                                    // moment(
                                                    //     dateStringToObj(
                                                    //         moment(
                                                    //             value
                                                    //         ).format(
                                                    //             "YYYY-MM-DD"
                                                    //         )
                                                    //     ),
                                                    //     "YYYY-MM-DD"
                                                    // )
                                                    moment(value, "YYYY-MM-DD")
                                                ),
                                                setDepartureDate(
                                                    moment(value, "YYYY-MM-DD")
                                                    // moment(
                                                    //     dateStringToObj(
                                                    //         moment(
                                                    //             value
                                                    //         ).format(
                                                    //             "YYYY-MM-DD"
                                                    //         )
                                                    //     ),
                                                    //     "YYYY-MM-DD"
                                                    // ).format("YYYY-MM-DD")
                                                )
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    size="small"
                                                    id={`DepartureDate`}
                                                    {...register(
                                                        `DepartureDate`
                                                    )}
                                                    margin="dense"
                                                    fullWidth
                                                    {...params}
                                                    error={
                                                        errors.DepartureDate
                                                            ?.message
                                                    }
                                                    helperText={
                                                        errors.DepartureDate
                                                            ?.message
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <CustomerSelect
                                    register={register}
                                    errors={errors}
                                    setEntity={setCustomerID}
                                    isCustomSelect={true}
                                />
                            </Grid>

                            {/* <Grid item sm={4} xs={6}>
                                <RateTypeSelect
                                    register={register}
                                    errors={errors}
                                    onChange={setRateType}
                                />
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <GuestSelect
                                    register={register}
                                    errors={errors}
                                    customRegisterName={`GuestName`}
                                    resetField={resetField}
                                    control={control}
                                    selectedGuest={selectedGuest}
                                    setSelectedGuest={setSelectedGuest}
                                    id={0}
                                />
                            </Grid> */}
                            {selectedGuest &&
                            (selectedGuest.value == null ||
                                selectedGuest.value == "" ||
                                selectedGuest.value == "createNew") ? (
                                <>
                                    <Grid item sm={4} xs={6}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="Name"
                                            label="Нэр"
                                            {...register(
                                                `TransactionDetail.${0}.GuestDetail.Name`
                                            )}
                                            margin="dense"
                                        />
                                    </Grid>

                                    <Grid item sm={4} xs={6}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="Email"
                                            label="Имэйл"
                                            type="email"
                                            {...register(
                                                `TransactionDetail.${0}.GuestDetail.Email`
                                            )}
                                            margin="dense"
                                        />
                                    </Grid>

                                    <Grid item sm={4} xs={6}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="Mobile"
                                            label="Гар утас"
                                            {...register(
                                                `TransactionDetail.${0}.GuestDetail.Mobile`
                                            )}
                                            margin="dense"
                                        />
                                    </Grid>
                                </>
                            ) : (
                                ""
                            )}
                        </Grid>
                    </CardContent>
                </Card>
                <Card className="mb-3" key={"Room"}>
                    <CardContent>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        background:
                                            "linear-gradient(135.79deg, rgba(128, 40, 210, 0.05) 4.62%, rgba(92, 33, 228, 0.05) 95.64%)",
                                        borderRadius: "8px",
                                        color: "#7856DE",
                                    }}
                                >
                                    <CheckroomIcon
                                        sx={{ fontSize: "16 !important" }}
                                    />
                                </div>
                                <Typography
                                    variant="subtitle1"
                                    style={{ marginLeft: "16px" }}
                                >
                                    Өрөөний мэдээлэл
                                </Typography>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        width: "150px",
                                        marginRight: "10px",
                                    }}
                                >
                                    <RoomTypeSelect
                                        register={register}
                                        errors={errors}
                                        onRoomTypeChange={setNewRoomTypeID}
                                        RoomTypeID={
                                            newRoomTypeID &&
                                            newRoomTypeID.RoomTypeID
                                                ? newRoomTypeID.RoomTypeID
                                                : null
                                        }
                                    />
                                </div>
                                <TextField
                                    label="Нэмэх тоо"
                                    type="number"
                                    margin="dense"
                                    size="small"
                                    style={{
                                        width: "100px",
                                        marginRight: "10px",
                                    }}
                                    value={newGroupCount}
                                    onChange={(e: any) => {
                                        setNewGroupCount(e.target.value);
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        //@ts-ignore
                                        {
                                            let tempValue = getValues(
                                                //@ts-ignore
                                                `TransactionDetail[0]`
                                            );
                                            if (newRoomTypeID) {
                                                tempValue.RoomTypeID =
                                                    newRoomTypeID.RoomTypeID;
                                                tempValue.Adult =
                                                    newRoomTypeID.BaseAdult;
                                                tempValue.Child =
                                                    newRoomTypeID.BaseChild;
                                            }
                                            for (
                                                let i = 0;
                                                i < newGroupCount;
                                                i++
                                            ) {
                                                append(tempValue);
                                            }
                                            setNewGroupCount(1);
                                        }
                                    }
                                    size="small"
                                    style={{
                                        height: "34.25px",
                                        width: "120px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    + Өрөө нэмэх
                                </Button>
                            </div>
                        </div>

                        {fields.map((field, index) => (
                            <>
                                <Divider className="mt-3 mb-3" />
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
                                    remove={remove}
                                    append={append}
                                    BreakfastIncluded={BreakfastIncluded}
                                    TaxIncluded={TaxIncluded}
                                    setBreakfastIncluded={setBreakfastIncluded}
                                    setTaxIncluded={setTaxIncluded}
                                    ArrivalDate={ArrivalDate}
                                    setArrivalDate={setArrivalDate}
                                    DepartureDate={DepartureDate}
                                    setDepartureDate={setDepartureDate}
                                    CustomerID={CustomerID}
                                />

                                {/* <Tooltip title="Remove">
                                                <IconButton
                                                    aria-label="close"
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                    disabled={index == 0}
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
                                            </Tooltip> */}
                            </>
                        ))}
                    </CardContent>
                </Card>

                <Card className="mb-3" key={"Payment"}>
                    <CardContent>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        background:
                                            "linear-gradient(135.79deg, rgba(128, 40, 210, 0.05) 4.62%, rgba(92, 33, 228, 0.05) 95.64%)",
                                        borderRadius: "8px",
                                        color: "#7856DE",
                                    }}
                                >
                                    <ReceiptIcon
                                        sx={{ fontSize: "16 !important" }}
                                    />
                                </div>
                                <Typography
                                    variant="subtitle1"
                                    style={{ marginLeft: "16px" }}
                                >
                                    Төлбөр
                                </Typography>
                            </div>
                        </div>
                        <br />
                        <Grid key="Payment" container spacing={1}>
                            <Grid item xs={6}>
                                <div
                                    style={{
                                        padding: "30px",
                                        borderRadius: "16px",
                                        gap: "50px",
                                        border: "1px solid #E6E8EE",
                                    }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <ReservationTypeSelect
                                                register={register}
                                                errors={errors}
                                                reset={reset}
                                                customRegisterName={`ReservationTypeID`}
                                                ReservationTypeID={
                                                    ReservationTypeID
                                                }
                                                setReservationTypeID={
                                                    setReservationTypeID
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Controller
                                                        name={`BreakfastIncluded`}
                                                        control={control}
                                                        render={(
                                                            props: any
                                                        ) => (
                                                            <Checkbox
                                                                {...register(
                                                                    `BreakfastIncluded`
                                                                )}
                                                                checked={
                                                                    BreakfastIncluded ==
                                                                    true
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e) =>
                                                                    setBreakfastIncluded(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                }
                                                label="Өглөөний цай"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Controller
                                                        name={`TaxIncluded`}
                                                        control={control}
                                                        render={(
                                                            props: any
                                                        ) => (
                                                            <Checkbox
                                                                {...register(
                                                                    `TaxIncluded`
                                                                )}
                                                                checked={
                                                                    TaxIncluded ==
                                                                    true
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e) =>
                                                                    setTaxIncluded(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                }
                                                label="Татвар"
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Controller
                                                        name={`ReservationSourceChecked`}
                                                        control={control}
                                                        render={(
                                                            props: any
                                                        ) => (
                                                            <Checkbox
                                                                checked={
                                                                    ReservationSourceChecked ==
                                                                    true
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e) =>
                                                                    setReservationSourceChecked(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                }
                                                label="Захиалгын эх сурвалж"
                                            />
                                        </Grid>

                                        {ReservationSourceChecked ? (
                                            <Grid item sm={12}>
                                                <ReservationSourceSelect
                                                    register={register}
                                                    errors={errors}
                                                    ChannelID={2}
                                                />
                                            </Grid>
                                        ) : (
                                            <></>
                                        )}

                                        <Grid item sm={12} md={4}>
                                            <Typography
                                                variant="caption"
                                                gutterBottom
                                            >
                                                Өдөр: {nights}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={12} md={4}>
                                            <Typography
                                                variant="caption"
                                                gutterBottom
                                            >
                                                Нийт өрөө: {fields.length}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={12} md={4}>
                                            <Typography
                                                variant="caption"
                                                gutterBottom
                                            >
                                                Нийт тооцоо:{" "}
                                                {formatPrice(totalAmount)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div
                                    style={{
                                        padding: "30px",
                                        borderRadius: "16px",
                                        gap: "50px",
                                        border: "1px solid #E6E8EE",
                                    }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <PaymentMethodSelect
                                                register={register}
                                                errors={errors}
                                                customRegisterName={`PaymentMethodID`}
                                                PaymentMethodID={
                                                    PaymentMethodID
                                                }
                                                setPaymentMethodID={
                                                    setPaymentMethodID
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <CurrencySelect
                                                register={register}
                                                errors={errors}
                                                nameKey={`PayCurrencyID`}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                id={`PayAmount`}
                                                label="PayAmount"
                                                type="number"
                                                {...register(`PayAmount`)}
                                                margin="dense"
                                                size="small"
                                                style={{
                                                    width: "100%",
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ReferenceSelect
                                                register={register}
                                                errors={errors}
                                                type="BillingInfo"
                                                label="Тооцоо төрөл"
                                                optionValue="BillingID"
                                                optionLabel="BillingName"
                                                customField="GroupBillTo"
                                                entity={billingInfo}
                                                setEntity={setBillingInfo}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
