import { TextField, Grid, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { ModalContext } from "lib/context/modal";
import { LoadingButton } from "@mui/lab";

import ChargeType from "./charge-type";
import PaymentMethod from "./payment-method";
import FolioSelect from "components/select/folio";
import { FolioAPI } from "lib/api/folio";

const ExtraCharge = ({
    transactionInfo,
    reservation,
    additionalMutateUrl,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [chargeTypes, setChargeTypes] = useState<any>(null);
    const [paymentMethods, setPaymentMethods] = useState<any>(null);

    const validationSchema = yup.object().shape({});
    const formOptions = { resolver: yupResolver(validationSchema) };
    console.log("chargeTypes", chargeTypes);
    console.log("paymentMethods", paymentMethods);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm(formOptions);

    const onSubmit = (values: any) => {
        setLoading(true);

        try {
            let tempValue: any = {};

            chargeTypes.forEach((element: any) => {
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
                    tempValue.Amount = element.Total ? element.Total : null;
                    tempValue.Quantity = element.BaseRate
                        ? element.BaseRate
                        : null;
                    tempValue.Description = element.ServiceDescription
                        ? element.ServiceDescription
                        : "";
                    FolioAPI.new(tempValue);
                    tempValue = {};
                }
            });

            paymentMethods.forEach((element: any) => {
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

                    FolioAPI.new(tempValue);
                    tempValue = {};
                }
            });

            toast("Амжилттай.");

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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <br />
                <br />
                <ChargeType
                    additionalMutateUrl={additionalMutateUrl}
                    entity={chargeTypes}
                    setEntity={setChargeTypes}
                />
                <br />
                <br />
                Төлбөр
                <br />
                <br />
                <PaymentMethod
                    additionalMutateUrl={additionalMutateUrl}
                    entity={paymentMethods}
                    setEntity={setPaymentMethods}
                    register={register}
                    errors={errors}
                />
                <LoadingButton
                    size="small"
                    type="submit"
                    variant="contained"
                    loading={loading}
                    className="mt-3"
                >
                    Хадгалах
                </LoadingButton>
            </form>
        </>
    );
};

export default ExtraCharge;
