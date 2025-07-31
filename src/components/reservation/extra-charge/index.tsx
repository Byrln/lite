import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { ModalContext } from "lib/context/modal";
import { LoadingButton } from "@mui/lab";
import { useIntl } from "react-intl";
import { Box } from "@mui/material";

import ChargeType from "./charge-type";
import PaymentMethod from "./payment-method";
import FolioSelect from "components/select/folio";
import { FolioAPI } from "lib/api/folio";
import { mutate } from "swr";

const ExtraCharge = ({
    transactionInfo,
    reservation,
    additionalMutateUrl,
}: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [chargeTypes, setChargeTypes] = useState<any>(null);
    const [paymentMethods, setPaymentMethods] = useState<any>(null);

    const validationSchema = yup.object().shape({});
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm(formOptions);

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            let tempValue: any = {};
            
            // Process charge types
            for (const element of chargeTypes || []) {
                if (element.isChecked && element.isChecked == true) {
                    tempValue.TransactionID = values.TransactionID
                        ? values.TransactionID
                        : null;
                    tempValue.FolioID = values.FolioID ? values.FolioID : null;
                    tempValue.TypeID = 1;
                    tempValue.CurrDate = transactionInfo.WorkingDate
                        ? transactionInfo.WorkingDate
                        : null;
                    tempValue.GroupID = element.RoomChargeTypeGroupID
                        ? element.RoomChargeTypeGroupID
                        : null;
                    tempValue.ItemID = element.RoomChargeTypeID
                        ? element.RoomChargeTypeID
                        : null;
                    tempValue.Amount = element.RoomChargeTypeRate
                        ? element.RoomChargeTypeRate
                        : null;
                    tempValue.Quantity = element.BaseRate
                        ? element.BaseRate
                        : null;
                    tempValue.Description = element.ServiceDescription
                        ? element.ServiceDescription
                        : "";
                    await FolioAPI.new(tempValue);
                    tempValue = {};
                }
            }

            // Process payment methods
            for (const element of paymentMethods || []) {
                if (element.isChecked && element.isChecked == true) {
                    tempValue.TransactionID = values.TransactionID
                        ? values.TransactionID
                        : null;
                    tempValue.FolioID = values.FolioID ? values.FolioID : null;
                    tempValue.TypeID = 2;
                    tempValue.CurrDate = transactionInfo.WorkingDate
                        ? transactionInfo.WorkingDate
                        : null;
                    tempValue.GroupID = element.PaymentMethodGroupID
                        ? element.PaymentMethodGroupID
                        : null;
                    tempValue.ItemID = element.PaymentMethodID
                        ? element.PaymentMethodID
                        : null;
                    tempValue.Amount = element.Amount ? element.Amount : null;
                    tempValue.Quantity = element.BaseRate
                        ? element.BaseRate
                        : null;
                    tempValue.PayCurrencyID = element.CurrencyID
                        ? element.CurrencyID
                        : null;
                    tempValue.Description = element.PaymentMethodName
                        ? element.PaymentMethodName
                        : "";

                    await FolioAPI.new(tempValue);
                    tempValue = {};
                }
            }

            // Invalidate cache to refresh UI
            await mutate("/api/Folio/Items");
            await mutate("/api/Folio/Details");
            await mutate("/api/Folio/DetailsByStatus");
            await mutate("/api/FrontOffice/TransactionInfo");
            // Invalidate all SWR caches to ensure UI refresh
            await mutate(() => true);
            if (additionalMutateUrl) {
                await mutate(additionalMutateUrl);
            }

            toast(
                intl.formatMessage({
                    id: "TextSuccess",
                })
            );

            setLoading(false);
            setChargeTypes({});
            setPaymentMethods({});

            reset();
            handleModal();
        } catch (error) {
            setLoading(false);
            setChargeTypes({});
            setPaymentMethods({});
            reset();
            handleModal();
        }
    };
    return (
        <>
            <form id="modal-form" onSubmit={handleSubmit(onSubmit)}>
                <div style={{ height: "60vh", overflow: "scroll" }}>
                    <input
                        type="hidden"
                        {...register("TransactionID")}
                        value={transactionInfo.TransactionID}
                    />
                    <FolioSelect
                        register={register}
                        errors={errors}
                        TransactionID={transactionInfo.TransactionID}
                        resetField={resetField}
                    />
                    <ChargeType
                        additionalMutateUrl={additionalMutateUrl}
                        entity={chargeTypes}
                        setEntity={setChargeTypes}
                        register={register}
                        errors={errors}
                    />

                    <br />
                    {intl.formatMessage({
                        id: "TextPayment",
                    })}
                    <br />
                    <PaymentMethod
                        additionalMutateUrl={additionalMutateUrl}
                        entity={paymentMethods}
                        setEntity={setPaymentMethods}
                        register={register}
                        errors={errors}
                    />
                </div>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                        flexDirection: "row-reverse",
                    }}
                    className="mb-1"
                >
                    <LoadingButton
                        size="small"
                        type="submit"
                        variant="contained"
                        loading={loading}
                        className="mt-3"
                    >
                        {intl.formatMessage({
                            id: "ButtonSave",
                        })}
                    </LoadingButton>
                </Box>
            </form>
        </>
    );
};

export default ExtraCharge;
