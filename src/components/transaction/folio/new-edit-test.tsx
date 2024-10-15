import { useState, useEffect, useCallback } from "react";
import { FrontOfficeAPI } from "lib/api/front-office";
import { FolioItemSWR } from "lib/api/folio";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FolioCharge from "./charge";
import ChargeFormArray from "./charge-form-array";
import PaymentFormArray from "./payment-from-array";

const NewEditTest = ({ FolioID, TransactionID, handleModal }: any) => {
    const [workingDate, setWorkingDate] = useState(null);
    const [entity, setEntity] = useState<any>({});
    const [rerenderKey, setRerenderKey] = useState(0);

    const { data, error } = FolioItemSWR(FolioID);

    useEffect(() => {
        if (data) {
            setEntity(data);
        }
    }, [data]);

    const onCheckboxChange = (e: any) => {
        let tempEntity = [...entity];
        tempEntity.forEach(
            (element: any) => (element.isChecked = e.target.checked)
        );
        setEntity(tempEntity);
        setRerenderKey((prevKey) => prevKey + 1);
    };

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
    };

    const [currentTab, setCurrentTab] = useState("Төлбөр");

    const [scrollableTab, setScrollableTab] = useState("Төлбөр");

    const handleChangeTab = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            setCurrentTab(newValue);
        },
        []
    );

    const handleChangeScrollableTab = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            setScrollableTab(newValue);
        },
        []
    );

    const TABS = [
        {
            value: "Төлбөр",
            label: (
                <PaymentFormArray
                    FolioID={FolioID}
                    TransactionID={TransactionID}
                    handleModal={handleModal}
                />
            ),
        },
        {
            value: "Тооцоо",
            label: (
                <ChargeFormArray
                    FolioID={FolioID}
                    TransactionID={TransactionID}
                    handleModal={handleModal}
                />
            ),
        },
    ];

    return (
        <div>
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Stack direction="column" spacing={2}>
                    <Tabs
                        value={currentTab}
                        onChange={handleChangeTab}
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "secondary",
                            },
                        }}
                        orientation="horizontal"
                    >
                        {TABS.slice(0, 2).map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                label={tab.value}
                                sx={{
                                    fontSize: "14px",
                                    justifyContent: "start",
                                }}
                            />
                        ))}
                    </Tabs>

                    {TABS.slice(0, 5).map(
                        (tab) =>
                            tab.value === currentTab && (
                                <Box
                                    key={tab.value}
                                    sx={{
                                        borderRadius: 1,
                                    }}
                                >
                                    {tab.label}
                                </Box>
                            )
                    )}
                </Stack>
            </LocalizationProvider>
        </div>
    );
};

export default NewEditTest;
