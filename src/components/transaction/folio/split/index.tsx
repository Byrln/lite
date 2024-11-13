import { Controller, useForm } from "react-hook-form";
import { Grid, FormControlLabel, Checkbox, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { mutate } from "swr";

import CustomSelect from "components/common/custom-select";
import NewEditForm from "components/common/new-edit-form";
import { FolioByStatusSWR, FolioAPI, listUrl } from "lib/api/folio";
import { dateStringToObj } from "lib/utils/helpers";

const validationSchema = yup.object().shape({
    CheckRC: yup.string().notRequired(),
    CheckEC: yup.string().notRequired(),
});

const NewEdit = ({ TransactionID, FolioID, handleModal, entities }: any) => {
    const [beginDate, setBeginDate]: any = useState(null);
    const [endDate, setEndDate]: any = useState(null);
    const [stay, setStay]: any = useState(true);
    const [selectedFolio, setSelectedFolio]: any = useState(null);

    const [reservation, setReservation]: any = useState(true);
    const [checkedOut, setCheckedOut]: any = useState(true);

    const { data, error } = FolioByStatusSWR(
        "",
        "",
        stay,
        reservation,
        checkedOut,
        false
    );
    const [newData, setNewData]: any = useState();
    useEffect(() => {
        // Filter folios based on stay date range
        if (data && (beginDate || endDate)) {
            const filtered = data.filter((folio: any) => {
                return (
                    moment(folio.StayDate)
                        .set({
                            hour: 0,
                            minute: 0,
                            second: 0,
                        })
                        .format("YYYY-MM-DD") >=
                        moment(beginDate)
                            .set({
                                hour: 0,
                                minute: 0,
                                second: 0,
                            })
                            .format("YYYY-MM-DD") &&
                    moment(folio.StayDate)
                        .set({
                            hour: 0,
                            minute: 0,
                            second: 0,
                        })
                        .format("YYYY-MM-DD") <=
                        moment(endDate)
                            .set({
                                hour: 23,
                                minute: 59,
                                second: 59,
                            })
                            .format("YYYY-MM-DD")
                );
            });
            setNewData(filtered);
            setSelectedFolio(null);
        } else {
            setNewData(data);
            setSelectedFolio(null);
        }
    }, [data, beginDate, endDate]);

    useEffect(() => {
        mutate("/api/Folio/DetailsByStatus");
    }, [stay, reservation, checkedOut]);

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
            let tempValues: any = {
                TransactionID: TransactionID,
                TargetFolioID: selectedFolio ? Number(selectedFolio) : 0,
                Items: [],
            };

            let newEntity = [];
            newEntity = entities.filter(
                (element: any) => element.isChecked == true
            );

            newEntity.forEach((element: any) =>
                tempValues.Items.push({
                    TypeID: element.TypeID,
                    CurrID: element.CurrID,
                })
            );

            FolioAPI.split(tempValues);
            handleModal();
        } finally {
            handleModal();
        }
    };

    const handleChange = (value: any) => {
        setSelectedFolio(value);
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
        <NewEditForm
            api={FolioAPI}
            listUrl={"/api/Folio/Items"}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <Grid container spacing={1}>
                <LocalizationProvider // @ts-ignore
                    dateAdapter={AdapterDateFns}
                >
                    <Grid item xs={6}>
                        <Controller
                            name="BeginDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label="Эхлэх өдөр"
                                    value={beginDate}
                                    onChange={(value) =>
                                        setBeginDate(
                                            moment(
                                                dateStringToObj(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                "YYYY-MM-DD"
                                            )
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="BeginDate"
                                            {...register("BeginDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.BeginDate?.message}
                                            helperText={
                                                errors.BeginDate?.message
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Controller
                            name="EndDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label="Дуусах өдөр"
                                    value={endDate}
                                    onChange={(value) =>
                                        setEndDate(
                                            moment(
                                                dateStringToObj(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                "YYYY-MM-DD"
                                            )
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="EndDate"
                                            {...register("EndDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.EndDate?.message}
                                            helperText={errors.EndDate?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="Stay"
                                    control={control}
                                    render={(props: any) => (
                                        <Checkbox
                                            checked={stay}
                                            onChange={(e) =>
                                                setStay(e.target.checked)
                                            }
                                        />
                                    )}
                                />
                            }
                            label="Байрлаж буй"
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="Reservation"
                                    control={control}
                                    render={(props: any) => (
                                        <Checkbox
                                            checked={reservation}
                                            onChange={(e) =>
                                                setReservation(e.target.checked)
                                            }
                                        />
                                    )}
                                />
                            }
                            label="Захиалга"
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="checkedOut"
                                    control={control}
                                    render={(props: any) => (
                                        <Checkbox
                                            checked={checkedOut}
                                            onChange={(e) =>
                                                setCheckedOut(e.target.checked)
                                            }
                                        />
                                    )}
                                />
                            }
                            label="Гарсан"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {newData && (
                            <CustomSelect
                                register={register}
                                errors={errors}
                                field={"TargetFolioID"}
                                label="Тооцоо"
                                options={newData}
                                optionValue="FolioID"
                                optionLabel="FolioFullName"
                                onChange={handleChange}
                            />
                        )}
                    </Grid>
                </LocalizationProvider>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
