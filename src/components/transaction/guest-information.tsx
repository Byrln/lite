import Box from "@mui/material/Box";
import { useIntl } from "react-intl";

const GuestInformation = ({ name, phone, email, address }: any) => {
  const intl = useIntl();

  return (
    <Box>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        flexWrap: "wrap",
      }}
        className="mb-1"
      ><div>{intl.formatMessage({ id: "TextName" })} : </div>
        <div style={{ fontWeight: "600" }}>{name}</div></Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
        className="mb-1"
      >
        <div>{intl.formatMessage({ id: "TextMobile" })} : </div>
        <div style={{ fontWeight: "600" }}>{phone}</div>
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
        <div>{intl.formatMessage({ id: "TextEmail" })} : </div>
        <div style={{ fontWeight: "600" }}>{email}</div>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <div>{intl.formatMessage({ id: "TextAddress" })} : </div>
        <div style={{ fontWeight: "600" }}>{address}</div>
      </Box>
    </Box>
  );
};

export default GuestInformation;
