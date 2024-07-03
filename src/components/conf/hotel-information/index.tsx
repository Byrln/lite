/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import CustomTab from "components/common/custom-tab";
import GeneralForm from "./GeneralForm";
import BankAccount from "./BankAccount";
import BookingEngine from "./BookingEngine";
import Banner from "./Banner";
import MainPictures from "./MainPictures";
import { useIntl } from "react-intl";
const HotelInformation = () => {
    const intl = useIntl();
    const tabs = [
        {
            label: intl.formatMessage({id:"TextPicture"}),
            component: (
                <>
                    <GeneralForm />
                </>
            ),
        },
        {
            label: intl.formatMessage({id:"AccountSettings"}),
            component: (
                <>
                    <BankAccount title={"Банкны данс"} />
                </>
            ),
        },
        {
            label: intl.formatMessage({id:"TextBookingEngine"}),
            component: (
                <>
                    <BookingEngine />
                </>
            ),
        },
        {
            label: intl.formatMessage({id:"TextBanner"}),
            component: (
                <>
                    <Banner />
                </>
            ),
        },
        {
            label: intl.formatMessage({id:"TextHotelPictures"}),
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
            <Box sx={{ width: "100%" }}>
                <CustomTab tabs={tabs} />
            </Box>
        </>
    );
};

export default HotelInformation;
