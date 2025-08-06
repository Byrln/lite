import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { ModalContext } from "lib/context/modal";
import { LoadingButton } from "@mui/lab";
import { useIntl } from "react-intl";
import { Box, Card, CardContent, Divider, Grid, Typography, Alert } from "@mui/material";
import { ChargeSummarySWR } from "lib/api/charge";
import { formatPrice } from "lib/utils/helpers";

import ChargeType from "./charge-type";
import PaymentMethod from "./payment-method";
import FolioSelect from "components/select/folio";
import ChargeTypeGroupSelect from "components/select/charge-type-group";
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
  const [chargeTypes, setChargeTypes] = useState<any>([]);
  const [paymentMethods, setPaymentMethods] = useState<any>(null);
  const [chargeType, setChargeType] = useState<any>(null);

  // Fetch charge summary data
  const { data: chargeSummaryData, error: chargeSummaryError, mutate: mutateChargeSummary } = ChargeSummarySWR(
    transactionInfo?.TransactionID || reservation?.TransactionID
  );

  // Helper function to format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount || 0) + '₮';
  };

  // Calculate real-time totals from current state
  const calculateRealTimeTotals = () => {
    const currentChargeTypesTotal = chargeTypes
      .filter((ct: any) => ct.isChecked)
      .reduce((sum: number, ct: any) => sum + (parseFloat(ct.Total) || 0), 0);

    const apiExtraCharges = chargeSummaryData && chargeSummaryData[0] ? chargeSummaryData[0].ExtraCharges || 0 : 0;
    const extraCharges = apiExtraCharges + currentChargeTypesTotal;

    const roomCharges = chargeSummaryData && chargeSummaryData[0] ? chargeSummaryData[0].RoomCharges || 0 : 0;

    return {
      extraCharges,
      roomCharges,
      totalCharges: extraCharges + roomCharges
    };
  };

  const realTimeTotals = calculateRealTimeTotals();

  // Refresh charge summary when chargeType changes
  useEffect(() => {
    if (chargeType !== null) {
      // Trigger a refresh of the charge summary data
      mutateChargeSummary();
    }
  }, [chargeType, mutateChargeSummary]);

  // Refresh charge summary when charge types are modified
  useEffect(() => {
    if (chargeTypes && chargeTypes.length > 0) {
      // Check if any charge type is checked or has quantity/amount changes
      const hasCheckedItems = chargeTypes.some((item: any) => item.isChecked);
      const hasTotalChanges = chargeTypes.some((item: any) => item.Total > 0);

      if (hasCheckedItems || hasTotalChanges) {
        mutateChargeSummary();
      }
    }
  }, [chargeTypes, mutateChargeSummary]);

  // Refresh charge summary when payment methods are modified
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0) {
      // Check if any payment method is checked or has amount changes
      const hasCheckedItems = paymentMethods.some((item: any) => item.isChecked);
      const hasAmountChanges = paymentMethods.some((item: any) => item.Amount > 0);

      if (hasCheckedItems || hasAmountChanges) {
        mutateChargeSummary();
      }
    }
  }, [paymentMethods, mutateChargeSummary]);

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
      setChargeTypes([]);
      setPaymentMethods([]);

      reset();
      handleModal();
    } catch (error) {
      setLoading(false);
      setChargeTypes([]);
      setPaymentMethods([]);
      reset();
      handleModal();
    }
  };
  return (
    <>
      <form id="modal-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <input
            type="hidden"
            {...register("TransactionID")}
            value={transactionInfo.TransactionID}
          />

          {/* Folio Selection */}
          <Box className="mb-6 flex items-center p-3 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-primary-main">
            <Typography variant="subtitle2" className="text-black font-medium w-[200px]">
              {intl.formatMessage({ id: "TextFolioSelection" }) || "Folio Selection"}
            </Typography>
            <FolioSelect
              register={register}
              errors={errors}
              TransactionID={transactionInfo.TransactionID}
              resetField={resetField}
            />
          </Box>
          {/* Responsive two-column layout for tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Charge Types Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="px-4 py-1 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <Typography variant="h6" className="text-gray-800 font-semibold flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {intl.formatMessage({ id: "TextExtraCharge" })}
                  </Typography>
                  <div className="flex-shrink-0">
                    <ChargeTypeGroupSelect
                      IsRoomCharge={false}
                      IsExtraCharge={true}
                      IsDiscount={false}
                      register={register}
                      errors={errors}
                      onChange={setChargeType}
                    />
                  </div>
                </div>
              </div>
              <div>
                <ChargeType
                  additionalMutateUrl={additionalMutateUrl}
                  entity={chargeTypes}
                  setEntity={setChargeTypes}
                  register={register}
                  errors={errors}
                  chargeType={chargeType}
                />
              </div>
            </div>

            {/* Payment Methods Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <Typography variant="h6" className="text-gray-800 font-semibold flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {intl.formatMessage({ id: "TextPayment" }) || "Payment Methods"}
                </Typography></div>
              <div>
                <PaymentMethod
                  additionalMutateUrl={additionalMutateUrl}
                  entity={paymentMethods}
                  setEntity={setPaymentMethods}
                  register={register}
                  errors={errors}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <Divider className="flex items-center my-4" />
        <Box className="flex justify-center mb-4">
          <div className="w-full max-w-4xl">
            <Card elevation={0} sx={{
              borderRadius: "24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0px 20px 40px rgba(102, 126, 234, 0.15), 0px 8px 16px rgba(118, 75, 162, 0.1)",
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: "0px 24px 48px rgba(102, 126, 234, 0.2), 0px 12px 24px rgba(118, 75, 162, 0.15)",
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ padding: { xs: "16px", sm: "24px", md: "32px" } }}>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} sm={4} md={4}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)", mb: 1, fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                        {intl.formatMessage({ id: "TextExtraCharge" })}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", fontSize: "2rem" }}>
                        {formatPrice(realTimeTotals.extraCharges)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1, borderLeft: { md: "1px solid rgba(255, 255, 255, 0.2)" }, borderRight: { md: "1px solid rgba(255, 255, 255, 0.2)" } }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)", mb: 1, fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                        {intl.formatMessage({ id: "TextRoomCharge" })}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", fontSize: "2rem" }}>
                        {formatPrice(realTimeTotals.roomCharges)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)", mb: 1, fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                        {intl.formatMessage({ id: "ReportTotalCharge" })}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", fontSize: "2rem" }}>
                        {formatPrice(realTimeTotals.totalCharges)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        </Box>
        <Box className="flex justify-end items-center">
          <Box className="flex gap-2">
            <LoadingButton
              size="medium"
              type="submit"
              variant="contained"
              loading={loading}
              disabled={loading}
              className="px-6 py-2 bg-primary-main hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-200"
              sx={{
                textTransform: 'none',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)',
                }
              }}
            >
              {loading ? (
                intl.formatMessage({ id: "TextSaving" }) || "Saving..."
              ) : (
                intl.formatMessage({ id: "ButtonSave" }) || "Save Changes"
              )}
            </LoadingButton>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default ExtraCharge;
