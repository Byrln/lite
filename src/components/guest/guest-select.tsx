import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography } from "@mui/material";
import SelectList from "components/guest/select-list";
import NewEdit from "./new-edit";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ModalContext } from "lib/context/modal";

const GuestSelect = ({ guestSelected }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    const [idEditing, setIdEditing]: any = useState(null);
    const [guestCurrent, setGuestCurrent]: any = useState(null);
    const [filterValues, setFilterValues]: any = useState({
        GuestID: 0,
        GuestName: "",
        CountryID: "0",
        IdentityValue: "",
        Phone: "",
        TransactionID: "",
        IsMainOnly: false,
    });

    const setGuest = (guest: any) => {
        setIdEditing(guest.GuestID);
        setGuestCurrent(guest);
    };

    const onInputChange = (guest: any) => {
        console.log("change", guest);
    };

    const onFilterValueChange = ({ key, value }: any) => {
        if (key == "GuestName") {
            setFilterValues({
                ...filterValues,
                GuestName: value,
            });
        }
        if (key == "IdentityValue") {
            setFilterValues({
                ...filterValues,
                IdentityValue: value,
            });
        }
        if (key == "Phone") {
            setFilterValues({
                ...filterValues,
                Phone: value,
            });
        }
    };

    const validationSchema = yup.object().shape(
        {
            // GuestTitleID: yup.string().required("Бөглөнө үү"),
            Name: yup.string().required("Бөглөнө үү"),
            Surname: yup.string().notRequired(),
            GenderID: yup.number().required("Бөглөнө үү"),
            RegistryNo: yup.string().when("IdentityTypeID", {
                is: (IdentityTypeID: number) => {
                    return IdentityTypeID === 1;
                },
                then: yup.string().required("Бөглөнө үү"),
                otherwise: yup.string().notRequired(),
            }),
            DriverLicenseNo: yup.string().when("IdentityTypeID", {
                is: (IdentityTypeID: number) => {
                    return IdentityTypeID === 2;
                },
                then: yup.string().required("Бөглөнө үү"),
                otherwise: yup.string().notRequired(),
            }),
            // RegistryNo: yup.string().when("DriverLicenseNo", {
            //     is: (DriverLicenseNo: any) => {
            //         console.log("DriverLicenseNo", DriverLicenseNo);
            //         return !DriverLicenseNo || DriverLicenseNo.length === 0;
            //     },
            //     then: yup.string().required("Бөглөнө үү"),
            //     otherwise: yup.string().notRequired(),
            // }),
            // DriverLicenseNo: yup.string().when("RegistryNo", {
            //     is: (RegistryNo: any) => {
            //         console.log("RegistryNo", RegistryNo);
            //         return !RegistryNo || RegistryNo.length === 0;
            //     },
            //     then: yup.string().required("Бөглөнө үү"),
            //     otherwise: yup.string().notRequired(),
            // }),
        },
        [["RegistryNo", "DriverLicenseNo"]]
    );

    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
    } = useForm(formOptions);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                component="div"
                                className="mb-3"
                            >
                                Guest Information
                            </Typography>
                            <NewEdit
                                onFilterValueChange={onFilterValueChange}
                                idEditing={idEditing}
                                onInputChange={onInputChange}
                                register={register}
                                handleSubmit={handleSubmit}
                                errors={errors}
                                reset={reset}
                                getValues={getValues}
                                filterValues={filterValues}
                                setGuest={setGuest}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* <Grid item xs={12} md={6}>
                    <SelectList
                        filterValues={filterValues}
                        setGuest={setGuest}
                    />
                </Grid> */}
            </Grid>

            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="mt-3"
            >
                <div></div>

                <Button
                    variant="contained"
                    onClick={(evt: any) => {
                        if (typeof guestSelected == "function") {
                            guestSelected(
                                guestCurrent ? guestCurrent : getValues()
                            );
                        }
                    }}
                    size="small"
                >
                    Continue <ArrowForwardIcon />
                </Button>
            </Grid>
        </>
    );
};

export default GuestSelect;
