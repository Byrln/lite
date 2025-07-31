import { useState } from "react";

import { useForm } from "react-hook-form";
import { TextField, Grid, Typography } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { CompanyDatabaseAPI, listUrl } from "lib/api/company-database";
import { useAppState } from "lib/context/app";
import CountrySelect from "components/select/country";
import CustomerGroupSelect from "components/select/customer-group";
import CustomerTypeSelect from "components/select/customer-type";

const validationSchema = yup.object().shape({
    CustomerName: yup.string().required("Бөглөнө үү"),
    CountryID: yup.string().nullable(),
    City: yup.string().nullable(),
    Address: yup.string().nullable(),
    RegisterNo: yup.string().nullable(),
    Phone: yup.string().nullable(),
    Email: yup.string().nullable(),
    CustomerGroupID: yup.string().nullable(),
    CustomerTypeID: yup.string().required("Сонгоно уу"),
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
    const intl = useIntl();
    const [entity, setEntity]: any = useState({
        CountryID: 146,
        CustomerTypeID: 1,
    });
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            CountryID: 146,
            CustomerTypeID: 1,
        },

        resolver: yupResolver(validationSchema),
    });

    return (
        <NewEditForm
            api={CompanyDatabaseAPI}
            listUrl={listUrl}
            additionalValues={{
                CustomerID: state.editId,
                ContactPersonTitleID1: 0,
                ContactPersonTitleID2: 0,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setEntity}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="CustomerName"
                                label={intl.formatMessage({
                                    id: "RowHeaderCompanyName",
                                })}
                                {...register("CustomerName")}
                                margin="dense"
                                error={!!errors.CustomerName?.message}
                                helperText={errors.CustomerName?.message as string}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CountrySelect
                                register={register}
                                errors={errors}
                                entity={entity}
                                setEntity={setEntity}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="City"
                                label={intl.formatMessage({ id: "TextCity" })}
                                {...register("City")}
                                margin="dense"
                                error={!!errors.City?.message}
                                helperText={errors.City?.message as string}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="RegisterNo"
                                label={intl.formatMessage({
                                    id: "TextRegisterNo",
                                })}
                                {...register("RegisterNo")}
                                margin="dense"
                                error={!!errors.RegisterNo?.message}
                                helperText={errors.RegisterNo?.message as string}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="Phone"
                                label={intl.formatMessage({
                                    id: "ReportPhone",
                                })}
                                {...register("Phone")}
                                margin="dense"
                                error={!!errors.Phone?.message}
                                helperText={errors.Phone?.message as string}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="Email"
                                label={intl.formatMessage({
                                    id: "RowHeaderEmail",
                                })}
                                {...register("Email")}
                                margin="dense"
                                error={!!errors.Email?.message}
                                helperText={errors.Email?.message as string}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CustomerGroupSelect
                                register={register}
                                errors={errors}
                                entity={entity}
                                setEntity={setEntity}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CustomerTypeSelect
                                register={register}
                                errors={errors}
                                entity={entity}
                                setEntity={setEntity}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                                id="Address"
                                label={intl.formatMessage({
                                    id: "ReportAddress",
                                })}
                                {...register("Address")}
                                margin="dense"
                                error={!!errors.Address?.message}
                                helperText={errors.Address?.message as string}
                            />
                        </Grid>
                    </Grid>

                    {/* <Remarks GuestID={state.editId} /> */}
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <div
                                style={{
                                    padding: "10px",
                                    borderRadius: "16px",
                                    border: "1px solid #E6E8EE",
                                }}
                            >
                                {/* <CardContent> */}
                                <Typography
                                    variant="subtitle1"
                                    component="div"
                                    className="mb-3"
                                >
                                    Холбогдох хүн 1
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonFirstName1"
                                            label={intl.formatMessage({
                                                id: "RowHeaderFirstName",
                                            })}
                                            {...register(
                                                "ContactPersonFirstName1"
                                            )}
                                            margin="dense"
                                            error={!!
                                                errors.ContactPersonFirstName1
                                                    ?.message
                                            }
                                            helperText={
                                                errors.ContactPersonFirstName1
                                                    ?.message as string
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonLastName1"
                                            label={intl.formatMessage({
                                                id: "RowHeaderLastName",
                                            })}
                                            {...register(
                                                "ContactPersonLastName1"
                                            )}
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
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonPosition1"
                                            label={intl.formatMessage({
                                                id: "TextWorkPosition",
                                            })}
                                            {...register(
                                                "ContactPersonPosition1"
                                            )}
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
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonPhone1"
                                            label={intl.formatMessage({
                                                id: "ReportPhone",
                                            })}
                                            {...register("ContactPersonPhone1")}
                                            error={
                                                errors.ContactPersonPhone1
                                                    ?.message
                                            }
                                            helperText={
                                                errors.ContactPersonPhone1
                                                    ?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonEmail1"
                                            label={intl.formatMessage({
                                                id: "RowHeaderEmail",
                                            })}
                                            {...register("ContactPersonEmail1")}
                                            margin="dense"
                                            error={
                                                errors.ContactPersonEmail1
                                                    ?.message
                                            }
                                            helperText={
                                                errors.ContactPersonEmail1
                                                    ?.message
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                {/* </CardContent> */}
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div
                                style={{
                                    padding: "10px",
                                    borderRadius: "16px",
                                    border: "1px solid #E6E8EE",
                                }}
                            >
                                {/* <CardContent> */}
                                <Typography
                                    variant="subtitle1"
                                    component="div"
                                    className="mb-3"
                                >
                                    Холбогдох хүн 2
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonFirstName2"
                                            label={intl.formatMessage({
                                                id: "RowHeaderFirstName",
                                            })}
                                            {...register(
                                                "ContactPersonFirstName2"
                                            )}
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
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonLastName2"
                                            label={intl.formatMessage({
                                                id: "RowHeaderLastName",
                                            })}
                                            {...register(
                                                "ContactPersonLastName2"
                                            )}
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
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonPosition2"
                                            label={intl.formatMessage({
                                                id: "TextWorkPosition",
                                            })}
                                            {...register(
                                                "ContactPersonPosition2"
                                            )}
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
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="ContactPersonPhone2"
                                            label={intl.formatMessage({
                                                id: "ReportPhone",
                                            })}
                                            {...register("ContactPersonPhone2")}
                                            margin="dense"
                                            error={
                                                errors.ContactPersonPhone2
                                                    ?.message
                                            }
                                            helperText={
                                                errors.ContactPersonPhone2
                                                    ?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="dense"
                                            error={
                                                errors.ContactPersonEmail2
                                                    ?.message
                                            }
                                            helperText={
                                                errors.ContactPersonEmail2
                                                    ?.message
                                            }
                                            label={intl.formatMessage({
                                                id: "RowHeaderEmail",
                                            })}
                                        />
                                    </Grid>
                                </Grid>
                                {/* </CardContent> */}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
