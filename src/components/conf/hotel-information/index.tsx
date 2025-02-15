/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import Link from "next/link";
import { Icon } from "@iconify/react";

import CustomTab from "components/common/custom-tab";
import GeneralForm from "./GeneralForm";
import BankAccount from "./BankAccount";
import BookingEngine from "./BookingEngine";
import Banner from "./Banner";
import MainPictures from "./MainPictures";
import { useIntl } from "react-intl";

const HotelInformation = ({ setHasData = null }: any) => {
    const intl = useIntl();
    const tabs = [
        {
            label: intl.formatMessage({ id: "TextGeneralInformation" }),
            component: (
                <>
                    <GeneralForm setHasData={setHasData} />
                </>
            ),
        },
        {
            label: intl.formatMessage({ id: "AccountSettings" }),
            component: (
                <>
                    <BankAccount title={"Банкны данс"} />
                </>
            ),
        },
        {
            label: intl.formatMessage({ id: "TextBookingEngine" }),
            component: (
                <>
                    <BookingEngine />
                </>
            ),
        },
        {
            label: intl.formatMessage({ id: "TextBanner" }),
            component: (
                <>
                    <Banner />
                </>
            ),
        },
        {
            label: intl.formatMessage({ id: "TextHotelPictures" }),
            component: (
                <>
                    <MainPictures />
                </>
            ),
        },
    ];

    // @ts-ignore
    return (
        <>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                <Link
                    href="https://youtu.be/Z8x-TXO4cM0?si=i_qfV0cAlALJ0LSy"
                    passHref
                >
                    <a
                        target="_blank"
                        style={{
                            paddingLeft: "6px",
                            paddingRight: "6px",
                            paddingTop: "3px",
                        }}
                    >
                        <Icon
                            icon="material-symbols:help-outline"
                            color="#1877F2"
                            height={24}
                        />
                    </a>
                </Link>
            </div>
            <Box sx={{ width: "100%" }}>
                <CustomTab tabs={tabs} />
            </Box>
        </>
    );
};

export default HotelInformation;
