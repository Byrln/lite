import { Box } from "@mui/material";
import { useIntl } from "react-intl";

import { ChargeSummarySWR } from "lib/api/charge";
import { formatPrice } from "lib/utils/helpers";

const Summary = ({ TransactionID }: any) => {
  const intl = useIntl();
  const { data, error } = ChargeSummarySWR(TransactionID);

  return data && data[0] ? (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
        className="mb-1"
      >
        <div>{intl.formatMessage({ id: 'transaction.summary.roomCharges' })} : </div>
        <div style={{ fontWeight: "600" }}>
          {formatPrice(data[0].RoomCharges)}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
        className="mb-1"
      >
        <div>{intl.formatMessage({ id: 'transaction.summary.extraCharges' })} : </div>
        <div style={{ fontWeight: "600" }}>
          {formatPrice(data[0].ExtraCharges)}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
        className="mb-1"
      >
        <div>{intl.formatMessage({ id: 'transaction.summary.miniBarCharges' })} : </div>
        <div style={{ fontWeight: "600" }}>
          {formatPrice(data[0].MiniBarCharges)}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
        className="mb-1"
      >
        <div>{intl.formatMessage({ id: 'transaction.summary.totalCharges' })} : </div>
        <div style={{ fontWeight: "600" }}>
          {formatPrice(data[0].TotalCharges)}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
        className="mb-1"
      >
        <div>{intl.formatMessage({ id: 'transaction.summary.totalPayments' })} : </div>
        <div style={{ fontWeight: "600" }}>
          {formatPrice(data[0].TotalPayments)}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <div>{intl.formatMessage({ id: 'transaction.summary.balance' })} : </div>
        <div style={{ fontWeight: "600" }}>
          {formatPrice(data[0].Balance)}
        </div>
      </Box>
    </Box>
  ) : (
    <Box>{intl.formatMessage({ id: 'transaction.summary.title' })}</Box>
  );
};

export default Summary;
