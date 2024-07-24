import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Tabs, Tab, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { useIntl } from "react-intl";

import NewEditForm from "components/common/new-edit-form";
import { ReasonAPI } from "lib/api/reason";
import { useAppState } from "lib/context/app";
import CustomSelect from "components/common/custom-select";
import PaymentMethodSelect from "components/select/payment-method";
import { listUrl as paymentMethodUrl } from "lib/api/payment-method";
import CurrencySelect from "components/select/currency";
import None from "./additional/none";
import AccountGroupSelect from "components/select/account-group";
import { AccountingAPI, detailExtUrl } from "lib/api/accounting";

const NewEdit = ({
    IsDebit,
    GroupID,
    CurrencyID,
    AccountID,
    handleModal,
    ItemID,
}: any) => {
    const intl = useIntl();
    const [paymentMethodGroupID, setPaymentMethodGroupID]: any =
        useState(GroupID);
    const [paymentMethodID, setPaymentMethodID]: any = useState(0);
    const [entity, setEntity] = useState({});
    const [value, setValue] = useState(0);
    const [currency, setCurrency] = useState({ CurrencyID: CurrencyID });
    const [accountGroup, setAccountGroup] = useState(null);
    const [isDebit, setIsDebit] = useState(true);

    const validationSchema = yup.object().shape({
        IsDebit: yup.string().required("Сонгоно уу").typeError("Сонгоно уу"),
        GroupID: yup.number().required("Сонгоно уу").typeError("Сонгоно уу"),
        CurrencyID: yup.number().required("Сонгоно уу").typeError("Сонгоно уу"),
        ItemID: yup.number().required("Сонгоно уу").typeError("Сонгоно уу"),
    });

    const fetchDatas = async () => {
        try {
            let response: any;
            response = await AccountingAPI.detailExt({
                IsDebit: IsDebit,
                GroupID: GroupID,
                CurrencyID: CurrencyID,
                AccountID: AccountID,
                ItemID: ItemID,
            });

            setEntity(response);
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [IsDebit, GroupID, CurrencyID, AccountID, ItemID]);

    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const handleOnChange = (value: any) => {
        setPaymentMethodGroupID(value);
        mutate(paymentMethodUrl);
    };

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
            <NewEditForm
                api={ReasonAPI}
                listUrl={detailExtUrl}
                additionalValues={{
                    ReasonID: state.editId,
                }}
                reset={reset}
                handleSubmit={handleSubmit}
            >
                <Grid container spacing={1}>
                    <Grid item sm={6} md={3}>
                        <CustomSelect
                            register={register}
                            errors={errors}
                            field="IsDebit"
                            label="Дансны төрөл"
                            options={[
                                { key: true, value: "Дебит" },
                                { key: false, value: "Кредит" },
                            ]}
                            optionValue="key"
                            optionLabel="value"
                            onChange={setIsDebit}
                        />
                    </Grid>

                    <Grid item sm={6} md={3}>
                        <AccountGroupSelect
                            register={register}
                            errors={errors}
                            AccountGroup={accountGroup}
                            setAccountGroup={setAccountGroup}
                            IsDebit={isDebit}
                        />
                    </Grid>

                    <Grid item sm={6} md={3}>
                        <PaymentMethodSelect
                            register={register}
                            errors={errors}
                            PaymentMethodGroupID={accountGroup}
                            setPaymentMethodID={setPaymentMethodID}
                            PaymentMethodID={paymentMethodID}
                            customRegisterName="ItemID"
                        />
                    </Grid>

                    <Grid item sm={6} md={3}>
                        <CurrencySelect
                            register={register}
                            errors={errors}
                            entity={currency}
                            setEntity={setCurrency}
                            nameKey="CurrencyID"
                        />
                    </Grid>
                </Grid>

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
                    {entity && (
                        <None entity={entity} handleModal={handleModal} />
                    )}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {/* {entity && (
                    <RoomType entity={entity} handleModal={handleModal} />
                )} */}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {/* {entity && <Room entity={entity} handleModal={handleModal} />} */}
                </TabPanel>
                <TabPanel value={value} index={3}>
                    {/* {entity && <Floor entity={entity} handleModal={handleModal} />} */}
                </TabPanel>
            </NewEditForm>
        </>
    );
};
export default NewEdit;
