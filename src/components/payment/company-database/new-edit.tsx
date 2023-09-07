import { useState } from "react";

import { useForm } from "react-hook-form";
import { TextField, Grid, Card, CardContent, Typography } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { CompanyDatabaseAPI, listUrl } from "lib/api/company-database";
import { useAppState } from "lib/context/app";
import CountrySelect from "components/select/country";
import CustomerGroupSelect from "components/select/customer-group";
import CustomerTypeSelect from "components/select/customer-type";
import Remarks from "./remarks";

const validationSchema = yup.object().shape({
    CustomerName: yup.string().nullable(),
    CountryID: yup.string().nullable(),
    City: yup.string().nullable(),
    Address: yup.string().nullable(),
    RegisterNo: yup.string().nullable(),
    Phone: yup.string().nullable(),
    Email: yup.string().nullable(),
    CustomerGroupID: yup.string().nullable(),
    CustomerTypeID: yup.string().nullable(),
    ContactPersonFirstName1: yup.string().nullable(),
    ContactPersonLastName1: yup.string().nullable(),
    ContactPersonPosition1: yup.string().nullable(),
    ContactPersonPhone1: yup.string().nullable(),
    ContactPersonEmail1: yup.string().nullable(),
    ContactPersonFirstName2: yup.string().nullable(),
    ContactPersonLastName2: yup.string().nullable(),
    ContactPersonPosition2: yup.string().nullable(),
    ContactPersonPhone2: yup.string().nullable(),
    ContactPersonEmail2: yup.string().nullable(),
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

    return (
        <NewEditForm
            api={CompanyDatabaseAPI}
            listUrl={listUrl}
            additionalValues={{
                CustomerID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setEntity}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <TextField
                                size="small"
                                fullWidth
                                id="Company Name"
                                label="CustomerName"
                                {...register("CustomerName")}
                                margin="dense"
                                error={errors.CustomerName?.message}
                                helperText={errors.CustomerName?.message}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <CountrySelect
                                register={register}
                                errors={errors}
                                entity={entity}
                                setEntity={setEntity}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                size="small"
                                fullWidth
                                id="City"
                                label="City"
                                {...register("City")}
                                margin="dense"
                                error={errors.City?.message}
                                helperText={errors.City?.message}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                size="small"
                                fullWidth
                                id="RegisterNo"
                                label="Registration No"
                                {...register("RegisterNo")}
                                margin="dense"
                                error={errors.RegisterNo?.message}
                                helperText={errors.RegisterNo?.message}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                size="small"
                                fullWidth
                                id="Phone"
                                label="PhoneNumber"
                                {...register("Phone")}
                                margin="dense"
                                error={errors.Phone?.message}
                                helperText={errors.Phone?.message}
                            />
                        </Grid>
                        <Grid item xs={4}>
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
                        <Grid item xs={4}>
                            <CustomerGroupSelect
                                register={register}
                                errors={errors}
                                entity={entity}
                                setEntity={setEntity}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <CustomerTypeSelect
                                register={register}
                                errors={errors}
                                entity={entity}
                                setEntity={setEntity}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                                id="Address"
                                label="Address"
                                {...register("Address")}
                                margin="dense"
                                error={errors.Address?.message}
                                helperText={errors.Address?.message}
                            />
                        </Grid>
                    </Grid>

                    {/* <Remarks GuestID={state.editId} /> */}
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                className="mb-3"
                            >
                                Contact Person 1
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonFirstName1"
                                        label="First Name"
                                        {...register("ContactPersonFirstName1")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonFirstName1
                                                ?.message
                                        }
                                        helperText={
                                            errors.ContactPersonFirstName1
                                                ?.message
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonLastName1"
                                        label="Last Name"
                                        {...register("ContactPersonLastName1")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonLastName1
                                                ?.message
                                        }
                                        helperText={
                                            errors.ContactPersonLastName1
                                                ?.message
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonPosition1"
                                        label="Work Position"
                                        {...register("ContactPersonPosition1")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonPosition1
                                                ?.message
                                        }
                                        helperText={
                                            errors.ContactPersonPosition1
                                                ?.message
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonPhone1"
                                        label="Phone"
                                        {...register("ContactPersonPhone1")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonPhone1?.message
                                        }
                                        helperText={
                                            errors.ContactPersonPhone1?.message
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonEmail1"
                                        label="Email"
                                        {...register("ContactPersonEmail1")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonEmail1?.message
                                        }
                                        helperText={
                                            errors.ContactPersonEmail1?.message
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card className="mt-3">
                        <CardContent>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                className="mb-3"
                            >
                                Contact Person 2
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonFirstName2"
                                        label="First Name"
                                        {...register("ContactPersonFirstName2")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonFirstName2
                                                ?.message
                                        }
                                        helperText={
                                            errors.ContactPersonFirstName2
                                                ?.message
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonLastName2"
                                        label="Last Name"
                                        {...register("ContactPersonLastName2")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonLastName2
                                                ?.message
                                        }
                                        helperText={
                                            errors.ContactPersonLastName2
                                                ?.message
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonPosition2"
                                        label="Work Position"
                                        {...register("ContactPersonPosition2")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonPosition2
                                                ?.message
                                        }
                                        helperText={
                                            errors.ContactPersonPosition2
                                                ?.message
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonPhone2"
                                        label="Phone"
                                        {...register("ContactPersonPhone2")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonPhone2?.message
                                        }
                                        helperText={
                                            errors.ContactPersonPhone2?.message
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="ContactPersonEmail2"
                                        label="Email"
                                        {...register("ContactPersonEmail2")}
                                        margin="dense"
                                        error={
                                            errors.ContactPersonEmail2?.message
                                        }
                                        helperText={
                                            errors.ContactPersonEmail2?.message
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
