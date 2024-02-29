import { Box } from "@mui/material";

import { ChargeSummarySWR } from "lib/api/charge";
import { formatPrice } from "lib/utils/helpers";

const Summary = ({ TransactionID }: any) => {
    const { data, error } = ChargeSummarySWR(TransactionID);

    return data && data[0] ? (
        <Box>
            <Box sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                Хураангуй
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
                <div>Өрөөний тооцоо : </div>
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
                <div>Нэмэлт үйлчилгээ : </div>
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
                <div>Мини бар : </div>
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
                <div>Нийт дүн : </div>
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
                <div>Төлсөн : </div>
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
                <div>Үлдэгдэл : </div>
                <div style={{ fontWeight: "600" }}>
                    {formatPrice(data[0].Balance)}
                </div>
            </Box>
        </Box>
    ) : (
        <Box>Summary</Box>
    );
};

export default Summary;
