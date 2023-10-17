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
import GuestDocumentsList from "./documents";

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
                        <Tab label="Зочны мэдээлэл" value="1" />
                        {state.isShow && <Tab label="Түүх" value="2" />}
                        {state.isShow && <Tab label="Тэмдэглэгээ" value="3" />}
                        {state.isShow && <Tab label="Бичиг баримт" value="4" />}
                    </TabList>
                </Box>
                <TabPanel value="1">
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
                                    label="Нэр"
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
                                    label="Овог"
                                    {...register("Surname")}
                                    margin="dense"
                                    error={errors.Surname?.message}
                                    helperText={errors.Surname?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    size="small"
                                    type="date"
                                    fullWidth
                                    id="DateOfBirth"
                                    label="Төрсөн өдөр"
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
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Mobile"
                                    label="Гар утас"
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
                                    label="Цахим шуудан"
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
                                    label="Компани"
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
                                    label="Утас"
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
                                    label="Регистрийн дугаар"
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
                                    label="Жол.үнэм.дугаар"
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
                                    label="Зип код"
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
                                    label="Хаяг"
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
