import { useState } from "react";
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Box,
    Typography,
    Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

import { WorkingDateAPI } from "lib/api/working-date";
import HotelInformation from "components/conf/hotel-information";
import AmenityList from "components/room/amenity/list";
import RoomTypeList from "components/room/type/list";
import RoomList from "components/room/list";
import TaxList from "components/rate/tax/list";
import RateTypeList from "components/rate/type/list";
import RateList from "components/rate/list";
import PaymentMethodList from "components/rate/payment-method/list";
import ExtraChargeGroupList from "components/rate/extra-charge-group/list";
import ExtraChargeList from "components/rate/extra-charge/list";
import MiniBarItemList from "components/mini-bar/item/list";
import UserRoleList from "components/conf/user-role/list";
import UserList from "components/conf/user/list";
import ReasonList from "components/conf/reason/list";
import CustomerGroupList from "components/conf/customer-group/list";
import CompanyDatabaseList from "components/payment/company-database/list";

const GuideList = ({ title, workingDate }: any) => {
    const router = useRouter();

    const intl = useIntl();

    const steps = [
        intl.formatMessage({
            id: "MenuHotelInformation",
        }),
        intl.formatMessage({
            id: "MenuRoomAmenities",
        }),
        intl.formatMessage({
            id: "MenuRoomType",
        }),
        intl.formatMessage({
            id: "MenuRooms",
        }),
        intl.formatMessage({
            id: "MenuTax",
        }),
        intl.formatMessage({
            id: "MenuRateType",
        }),
        intl.formatMessage({
            id: "MenuRates",
        }),
        intl.formatMessage({
            id: "MenuPaymentMethod",
        }),
        intl.formatMessage({
            id: "MenuExtraChargeGroup",
        }),
        intl.formatMessage({
            id: "MenuExtraCharges",
        }),
        intl.formatMessage({
            id: "MenuMiniBar",
        }),
        intl.formatMessage({
            id: "MenuUserRole",
        }),
        intl.formatMessage({
            id: "MenuUser",
        }),
        intl.formatMessage({
            id: "MenuReasons",
        }),
        intl.formatMessage({
            id: "MenuCustomerGroup",
        }),
        intl.formatMessage({
            id: "MenuCompanyDatabase",
        }),
    ];

    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [hotelInformationCompleted, setHotelInformationCompleted] =
        useState(false);
    const [amenityCompleted, setAmenityCompleted] = useState(false);
    const [roomTypesCompleted, setRoomTypesCompleted] = useState(false);
    const [roomsCompleted, setRoomsCompleted] = useState(false);
    const [taxCompleted, setTaxCompleted] = useState(false);
    const [rateTypesCompleted, setRateTypesCompleted] = useState(false);
    const [ratesCompleted, setRatesCompleted] = useState(false);
    const [paymentMethodCompleted, setPaymentMethodCompleted] = useState(false);
    const [extraChargeGroupCompleted, setExtraChargeGroupCompleted] =
        useState(false);
    const [extraChargeCompleted, setExtraChargeCompleted] = useState(false);
    const [miniBarCompleted, setMiniBarCompleted] = useState(false);
    const [userRoleCompleted, setUserRoleCompleted] = useState(false);
    const [userCompleted, setUserCompleted] = useState(false);
    const [reasonCompleted, setReasonCompleted] = useState(false);
    const [customerGroupCompleted, setCustomerGroupCompleted] = useState(false);
    const [companyDatabaseCompleted, setCompanyDatabaseCompleted] =
        useState(false);

    const handleNext = () => {
        if (activeStep == 0) {
            if (hotelInformationCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Зочин буудлын мэдээлэл оруулна уу",
                    })
                );
            }
        } else if (activeStep == 1) {
            if (amenityCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Өрөөний онцлог оруулна уу",
                    })
                );
            }
        } else if (activeStep == 2) {
            if (roomTypesCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Өрөөний төрөл оруулна уу",
                    })
                );
            }
        } else if (activeStep == 3) {
            if (roomsCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Өрөөний мэдээлэл оруулна уу",
                    })
                );
            }
        } else if (activeStep == 4) {
            if (taxCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Татварын мэдээлэл оруулна уу",
                    })
                );
            }
        } else if (activeStep == 5) {
            if (rateTypesCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Тарифийн төрөл оруулна уу",
                    })
                );
            }
        } else if (activeStep == 6) {
            if (ratesCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Тариф оруулна уу",
                    })
                );
            }
        } else if (activeStep == 7) {
            if (paymentMethodCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Төлбөрийн хэлбэр оруулна уу",
                    })
                );
            }
        } else if (activeStep == 8) {
            if (extraChargeGroupCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Нэм.Үйлчилгээ бүлэг оруулна уу",
                    })
                );
            }
        } else if (activeStep == 9) {
            if (extraChargeCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Нэм.Үйлчилгээ оруулна уу",
                    })
                );
            }
        } else if (activeStep == 10) {
            if (miniBarCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Мини бар оруулна уу",
                    })
                );
            }
        } else if (activeStep == 11) {
            if (userRoleCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Хэрэглэгчийн эрх оруулна уу",
                    })
                );
            }
        } else if (activeStep == 12) {
            if (userCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Хэрэглэгч оруулна уу",
                    })
                );
            }
        } else if (activeStep == 13) {
            if (reasonCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Шалтгаан оруулна уу",
                    })
                );
            }
        } else if (activeStep == 14) {
            if (customerGroupCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast(
                    intl.formatMessage({
                        id: "Хэрэглэгчийн групп оруулна уу",
                    })
                );
            }
        } else if (activeStep == 15) {
            if (companyDatabaseCompleted) {
                router.replace("/");
            } else {
                toast(
                    intl.formatMessage({
                        id: "Байгууллага оруулна уу",
                    })
                );
            }
        } else {
            router.replace("/");
        }
    };

    const handleBack = async () => {
        setLoading(true);

        try {
            if (activeStep === 0) {
                await WorkingDateAPI.reverse();

                toast("Амжилттай.");
                router.replace("/");
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep - 1);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        } finally {
        }
    };

    return (
        <>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {activeStep === 0 ? (
                    <></>
                ) : (
                    <Button
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        disabled={loading}
                    >
                        {intl.formatMessage({
                            id: "ButtonReturn",
                        })}
                    </Button>
                )}
                <Box sx={{ flex: "1 1 auto" }} />

                {activeStep < 16 && (
                    <Button onClick={handleNext}>
                        {activeStep === steps.length - 1
                            ? intl.formatMessage({
                                  id: "ButtonFinish",
                              })
                            : intl.formatMessage({
                                  id: "ButtonNext",
                              })}
                    </Button>
                )}
            </Box>
            <br />
            <Divider />
            <br />
            {activeStep == 0 ? (
                <Box sx={{ pt: 2 }}>
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuHotelInformation",
                        })}
                    </Typography>

                    <HotelInformation
                        setHasData={setHotelInformationCompleted}
                    />
                </Box>
            ) : activeStep == 1 ? (
                <Box sx={{ pt: 2 }}>
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuRoomAmenities",
                        })}
                    </Typography>

                    <AmenityList setHasData={setAmenityCompleted} />
                </Box>
            ) : activeStep == 2 ? (
                <Box sx={{ pt: 2 }}>
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuRoomType",
                        })}
                    </Typography>
                    <RoomTypeList setHasData={setRoomTypesCompleted} />
                </Box>
            ) : activeStep == 3 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuRooms",
                        })}
                    </Typography>
                    <RoomList setHasData={setRoomsCompleted} />
                </Box>
            ) : activeStep == 4 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuTax",
                        })}
                    </Typography>
                    <TaxList setHasData={setTaxCompleted} />
                </Box>
            ) : activeStep == 5 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuRateType",
                        })}
                    </Typography>
                    <RateTypeList setHasData={setRateTypesCompleted} />
                </Box>
            ) : activeStep == 6 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuRates",
                        })}
                    </Typography>
                    <RateList setHasData={setRatesCompleted} />
                </Box>
            ) : activeStep == 7 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuPaymentMethod",
                        })}
                    </Typography>
                    <PaymentMethodList setHasData={setPaymentMethodCompleted} />
                </Box>
            ) : activeStep == 8 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuExtraChargeGroup",
                        })}
                    </Typography>
                    <ExtraChargeGroupList
                        setHasData={setExtraChargeGroupCompleted}
                    />
                </Box>
            ) : activeStep == 9 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuExtraCharges",
                        })}
                    </Typography>
                    <ExtraChargeList setHasData={setExtraChargeCompleted} />
                </Box>
            ) : activeStep == 10 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuMiniBar",
                        })}
                    </Typography>
                    <MiniBarItemList setHasData={setMiniBarCompleted} />
                </Box>
            ) : activeStep == 11 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuUserRole",
                        })}
                    </Typography>
                    <UserRoleList setHasData={setUserRoleCompleted} />
                </Box>
            ) : activeStep == 12 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuUser",
                        })}
                    </Typography>
                    <UserList setHasData={setUserCompleted} />
                </Box>
            ) : activeStep == 13 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuReasons",
                        })}
                    </Typography>
                    <ReasonList setHasData={setReasonCompleted} />
                </Box>
            ) : activeStep == 14 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuCustomerGroup",
                        })}
                    </Typography>
                    <CustomerGroupList setHasData={setCustomerGroupCompleted} />
                </Box>
            ) : activeStep == 15 ? (
                <Box sx={{ pt: 2 }}>
                    {" "}
                    <Typography variant="h6">
                        {intl.formatMessage({
                            id: "MenuCompanyDatabase",
                        })}
                    </Typography>
                    <CompanyDatabaseList
                        setHasData={setCompanyDatabaseCompleted}
                    />
                </Box>
            ) : (
                <></>
            )}
        </>
    );
};

export default GuideList;
