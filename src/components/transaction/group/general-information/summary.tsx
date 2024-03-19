import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { ChargeSummarySWR } from "lib/api/charge";
import { GroupSummarySWR } from "lib/api/folio";
import { formatPrice } from "lib/utils/helpers";

const Summary = ({ TransactionID, GroupID }: any) => {
    const { data, error } = GroupID
        ? GroupSummarySWR(GroupID)
        : ChargeSummarySWR(TransactionID);
    const [newData, setNewData] = useState<any>();
    useEffect(() => {
        if (data) {
            setNewData({
                Balance: data.reduce(
                    (acc: any, obj: any) => acc + obj.Balance,
                    0
                ),
                TotalPayment:
                    data && data[0] && data[0].TotalPayments
                        ? data.reduce(
                              (acc: any, obj: any) => acc + obj.TotalPayments,
                              0
                          )
                        : data.reduce(
                              (acc: any, obj: any) => acc + obj.TotalPayment,
                              0
                          ),
                TotalCharge:
                    data && data[0] && data[0].TotalCharges
                        ? data.reduce(
                              (acc: any, obj: any) => acc + obj.TotalCharges,
                              0
                          )
                        : data.reduce(
                              (acc: any, obj: any) => acc + obj.TotalCharge,
                              0
                          ),
                MiniBarCharge:
                    data && data[0] && data[0].MiniBarCharges
                        ? data.reduce(
                              (acc: any, obj: any) => acc + obj.MiniBarCharges,
                              0
                          )
                        : data.reduce(
                              (acc: any, obj: any) => acc + obj.MiniBarCharge,
                              0
                          ),
                ExtraCharge:
                    data && data[0] && data[0].ExtraCharges
                        ? data.reduce(
                              (acc: any, obj: any) => acc + obj.ExtraCharges,
                              0
                          )
                        : data.reduce(
                              (acc: any, obj: any) => acc + obj.ExtraCharge,
                              0
                          ),
                RoomCharge:
                    data && data[0] && data[0].RoomCharges
                        ? data.reduce(
                              (acc: any, obj: any) => acc + obj.RoomCharges,
                              0
                          )
                        : data.reduce(
                              (acc: any, obj: any) => acc + obj.RoomCharge,
                              0
                          ),
            });
        }
    }, [data]);

    return data && newData && newData ? (
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
                    {newData && newData.RoomCharge
                        ? formatPrice(newData.RoomCharge)
                        : 0}
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
                    {newData && newData.ExtraCharge
                        ? formatPrice(newData.ExtraCharge)
                        : 0}
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
                    {newData && newData.MiniBarCharge
                        ? formatPrice(newData.MiniBarCharge)
                        : 0}
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
                    {newData && newData.TotalCharge
                        ? formatPrice(newData.TotalCharge)
                        : 0}
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
                    {newData && newData.TotalPayment
                        ? formatPrice(newData.TotalPayment)
                        : 0}
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
                    {newData && newData.Balance
                        ? formatPrice(newData.Balance)
                        : 0}
                </div>
            </Box>
        </Box>
    ) : (
        <Box>Summary</Box>
    );
};

export default Summary;
