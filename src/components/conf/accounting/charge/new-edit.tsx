import { useForm } from "react-hook-form";
import { TextField, Tabs, Tab, Typography, Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import { useState, useEffect } from "react";

import NewEditForm from "components/common/new-edit-form";

import { useAppState } from "lib/context/app";
import None from "./additional/none";
import RoomType from "./additional/room-type";
import Room from "./additional/room";
import Floor from "./additional/floor";

import {
    AccountingExtraChargeSWR,
    extraChargeUrl,
    AccountingExtraChargeAPI,
} from "lib/api/accounting-extra-charge";

const validationSchema = yup.object().shape({
    ReasonTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
});

const NewEdit = ({ RoomChargeTypeID, handleModal }: any) => {
    const intl = useIntl();
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });
    const [entity, setEntity] = useState({});
    const [value, setValue] = useState(0);

    const fetchDatas = async () => {
        try {
            let response: any;
            response = await AccountingExtraChargeAPI.get(RoomChargeTypeID);

            setEntity(response);
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [RoomChargeTypeID]);

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box className="mt-3">
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label={intl.formatMessage({
                    id: "MenuAccounting",
                })}
            >
                <Tab
                    label={intl.formatMessage({ id: "TextNone" })}
                    {...a11yProps(0)}
                />
                <Tab
                    label={intl.formatMessage({ id: "TextRoomType" })}
                    {...a11yProps(1)}
                />
                <Tab
                    label={intl.formatMessage({ id: "TextRoom" })}
                    {...a11yProps(2)}
                />
                <Tab
                    label={intl.formatMessage({ id: "TextFloor" })}
                    {...a11yProps(3)}
                />
            </Tabs>

            <TabPanel value={value} index={0}>
                {entity && <None entity={entity} handleModal={handleModal} />}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {entity && (
                    <RoomType entity={entity} handleModal={handleModal} />
                )}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {entity && <Room entity={entity} handleModal={handleModal} />}
            </TabPanel>
            <TabPanel value={value} index={3}>
                {entity && <Floor entity={entity} handleModal={handleModal} />}
            </TabPanel>
        </>
    );
};
export default NewEdit;
