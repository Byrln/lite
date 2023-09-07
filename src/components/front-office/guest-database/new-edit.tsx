import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Grid from "@mui/material/Grid";

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

const validationSchema = yup.object().shape({
    GuestTitleID: yup.number().notRequired(),
    Name: yup.string().required("Бөглөнө үү"),
    Surname: yup.string().required("Бөглөнө үү"),
    RegistryNo: yup.string().required("Бөглөнө үү"),
    DriverLicenseNo: yup.string().notRequired(),
    DateOfBirth: yup.date().required("Бөглөнө үү"),
    GenderID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
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

    // useEffect(() => {
    //     if (entity) {
    //         console.log("entity", entity);
    //         // let tempEntity = { ...entity };
    //         // tempEntity.DateOfBirth = new Date(tempEntity.DateOfBirth);
    //         // console.log("testestest", tempEntity.DateOfBirth);
    //         // setEntity(tempEntity);
    //     }
    // }, [entity]);

    return (
        <>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange}>
                        <Tab label="Guest Information" value="1" />
                        {state.isShow && <Tab label="History" value="2" />}
                        {state.isShow && <Tab label="Remarks" value="3" />}
                        {state.isShow && <Tab label="Documents" value="4" />}
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <NewEditForm
                        api={GuestdatabaseAPI}
                        listUrl={listUrl}
                        additionalValues={{
                            GuestID: state.editId,
                        }}
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
                                    label="Name"
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
                                    label="Surname"
                                    {...register("Surname")}
                                    margin="dense"
                                    error={errors.Surname?.message}
                                    helperText={errors.Surname?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="RegistryNo"
                                    label="Registration No"
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
                                    label="Driver License No"
                                    {...register("DriverLicenseNo")}
                                    margin="dense"
                                    error={errors.DriverLicenseNo?.message}
                                    helperText={errors.DriverLicenseNo?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    type="date"
                                    fullWidth
                                    id="DateOfBirth"
                                    label="Date of Birth"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...register("DateOfBirth")}
                                    margin="dense"
                                    error={errors.DateOfBirth?.message}
                                    helperText={errors.DateOfBirth?.message}
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
                                <CountrySelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <GenderSelect
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
                                    id="Phone"
                                    label="Phone"
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
                                    id="Zip"
                                    label="Zip"
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
                                    id="Company"
                                    label="Company"
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
                                    id="Mobile"
                                    label="Mobile"
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
                                    label="Email"
                                    {...register("Email")}
                                    margin="dense"
                                    error={errors.Email?.message}
                                    helperText={errors.Email?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Address"
                                    label="Address"
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
                <TabPanel value="4">Item Four</TabPanel>
            </TabContext>
        </>
    );
};

export default NewEdit;
