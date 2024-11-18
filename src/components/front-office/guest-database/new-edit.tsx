import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useIntl } from "react-intl";

import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { GuestdatabaseAPI, listUrl } from "lib/api/guest-database";
import { useAppState } from "lib/context/app";
import GenderSelect from "components/select/gender";
import VipStatusSelect from "components/select/vip-status";
import CountrySelect from "components/select/country";
import GuestTitleSelect from "components/select/guest-title";
import GuestHistoryList from "./history";
import GuestHistorySummaryList from "./history-summary";
import GuestRemarksList from "./remarks";
import GuestDocumentsList from "./documents";
import { dateStringToObj } from "lib/utils/helpers";

const validationSchema = yup.object().shape({
    GuestTitleID: yup.number().notRequired(),
    Name: yup.string().required("Бөглөнө үү"),
    Surname: yup.string().notRequired(),
    RegistryNo: yup.string().notRequired().nullable(),
    DriverLicenseNo: yup.string().notRequired().nullable(),
    DateOfBirth: yup.date().notRequired().nullable(),
    GenderID: yup.string().notRequired().nullable(),
    Address: yup.string().notRequired(),
    CountryID: yup.string().notRequired(),
    Zip: yup.string().notRequired(),
    Phone: yup.string().notRequired(),
    Mobile: yup.string().notRequired(),
    Email: yup.string().notRequired(),
    VipStatusID: yup.number().notRequired(),
    Company: yup.string().notRequired(),
});

const NewEdit = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });
    const [value, setValue] = React.useState("1");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange}>
                        <Tab
                            label={intl.formatMessage({
                                id: "TextGuestDetail",
                            })}
                            value="1"
                        />
                        {state.isShow && (
                            <Tab
                                label={intl.formatMessage({
                                    id: "TextHistory",
                                })}
                                value="2"
                            />
                        )}
                        {state.isShow && (
                            <Tab
                                label={intl.formatMessage({
                                    id: "TextHeaderRemarks",
                                })}
                                value="3"
                            />
                        )}
                        {state.isShow && (
                            <Tab
                                label={intl.formatMessage({
                                    id: "TextDocuments",
                                })}
                                value="4"
                            />
                        )}
                    </TabList>
                </Box>
                <TabPanel
                    value="1"
                    style={{ padding: "24px 0 0 0", margin: "0px" }}
                >
                    <img //@ts-ignore
                        src={`https://pmsapi.horecasoft.mn/images/guestpictures/hotel_${localStorage.getItem(
                            "hotelId"
                        )}/${state.editId}.jpeg`}
                        alt={state.editId}
                        style={{
                            height: "100px",
                            objectFit: "cover",
                        }}
                        className="mb-3"
                    />
                    <NewEditForm
                        api={GuestdatabaseAPI}
                        listUrl={listUrl}
                        additionalValues={
                            state.editId && {
                                GuestID: state.editId,
                            }
                        }
                        reset={reset}
                        handleSubmit={handleSubmit}
                        setEntity={setEntity}
                        dateKeys={["DateOfBirth"]}
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={3}>
                                <GuestTitleSelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Name"
                                    label={intl.formatMessage({
                                        id: "RowHeaderFirstName",
                                    })}
                                    {...register("Name")}
                                    margin="dense"
                                    error={errors.Name?.message}
                                    helperText={errors.Name?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Surname"
                                    label={intl.formatMessage({
                                        id: "RowHeaderLastName",
                                    })}
                                    {...register("Surname")}
                                    margin="dense"
                                    error={errors.Surname?.message}
                                    helperText={errors.Surname?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <LocalizationProvider
                                    //@ts-ignore
                                    dateAdapter={AdapterDateFns}
                                >
                                    <Controller
                                        name="DateOfBirth"
                                        control={control}
                                        defaultValue={null}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <DatePicker
                                                label={intl.formatMessage({
                                                    id: "TextDateOfBirth",
                                                })}
                                                value={value}
                                                onChange={(value) =>
                                                    onChange(
                                                        moment(
                                                            dateStringToObj(
                                                                moment(
                                                                    value
                                                                ).format(
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
                                                        id="DateOfBirth"
                                                        {...register(
                                                            "DateOfBirth"
                                                        )}
                                                        margin="dense"
                                                        fullWidth
                                                        {...params}
                                                        error={
                                                            errors.DateOfBirth
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors.DateOfBirth
                                                                ?.message
                                                        }
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Mobile"
                                    label={intl.formatMessage({
                                        id: "TextMobile",
                                    })}
                                    {...register("Mobile")}
                                    margin="dense"
                                    error={errors.Mobile?.message}
                                    helperText={errors.Mobile?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Email"
                                    label={intl.formatMessage({
                                        id: "TextEmail",
                                    })}
                                    {...register("Email")}
                                    margin="dense"
                                    error={errors.Email?.message}
                                    helperText={errors.Email?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <VipStatusSelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Company"
                                    label={intl.formatMessage({
                                        id: "RowHeaderCompany",
                                    })}
                                    {...register("Company")}
                                    margin="dense"
                                    error={errors.Company?.message}
                                    helperText={errors.Company?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Phone"
                                    label={intl.formatMessage({
                                        id: "TextPhone",
                                    })}
                                    {...register("Phone")}
                                    margin="dense"
                                    error={errors.Phone?.message}
                                    helperText={errors.Phone?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="RegistryNo"
                                    label={intl.formatMessage({
                                        id: "RowHeaderRegistryNo",
                                    })}
                                    {...register("RegistryNo")}
                                    margin="dense"
                                    error={errors.RegistryNo?.message}
                                    helperText={errors.RegistryNo?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="DriverLicenseNo"
                                    label={intl.formatMessage({
                                        id: "TextDriverLicenseNo",
                                    })}
                                    {...register("DriverLicenseNo")}
                                    margin="dense"
                                    error={errors.DriverLicenseNo?.message}
                                    helperText={errors.DriverLicenseNo?.message}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <GenderSelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
                                    reset={reset}
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <CountrySelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Zip"
                                    label={intl.formatMessage({
                                        id: "TextZip",
                                    })}
                                    {...register("Zip")}
                                    margin="dense"
                                    error={errors.Zip?.message}
                                    helperText={errors.Zip?.message}
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Address"
                                    label={intl.formatMessage({
                                        id: "TextAddress",
                                    })}
                                    {...register("Address")}
                                    margin="dense"
                                    error={errors.Address?.message}
                                    helperText={errors.Address?.message}
                                />
                            </Grid>
                        </Grid>
                    </NewEditForm>
                </TabPanel>
                <TabPanel value="2">
                    <GuestHistorySummaryList />
                    <GuestHistoryList />
                </TabPanel>
                <TabPanel value="3">
                    <GuestRemarksList />
                </TabPanel>
                <TabPanel value="4">
                    <GuestDocumentsList />
                </TabPanel>
            </TabContext>
        </>
    );
};

export default NewEdit;
