/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import CustomTab from "components/common/custom-tab";
import GeneralForm from "./GeneralForm";
import BankAccount from "./BankAccount";

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
        { label: "Дансны тохиргоо",
            component: (
                <>
                    <BankAccount title={'Банкны данс'}/>
                </>
            )
        },
        { label: "Шууд захиалга",
            component: (
                <>
                </>
            )
        },
        { label: "Баннер",
            component: (
                <>
                </>
            )
        },
        { label: "Буудлын зураг",
            component: (
                <>
                </>
            )
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
