/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import CustomTab from "components/common/custom-tab";
import GeneralForm from "./GeneralForm";
import BankAccount from "./BankAccount";
import BookingEngine from "./BookingEngine";
import Banner from "./Banner";
import MainPictures from "./MainPictures";

const HotelInformation = () => {
    const tabs = [
        {
            label: "Үндсэн тохиргоо",
            component: (
                <>
                    <GeneralForm />
                </>
            ),
        },
        {
            label: "Дансны тохиргоо",
            component: (
                <>
                    <BankAccount title={"Банкны данс"} />
                </>
            ),
        },
        {
            label: "Шууд захиалга",
            component: (
                <>
                    <BookingEngine />
                </>
            ),
        },
        {
            label: "Баннер",
            component: (
                <>
                    <Banner />
                </>
            ),
        },
        {
            label: "Буудлын зураг",
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
