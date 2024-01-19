import { useState } from "react";
import { ReservationRemarkSWR } from "lib/api/reservation-remark";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { fToCustom } from "../../../lib/utils/format-time";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemarkNew from "./new";

const RemarkList = ({ TransactionID }: any) => {
    const { data, error } = ReservationRemarkSWR(TransactionID);
    const [editMode, setEditMode] = useState(false);

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </Box>
        );

    return (
        <>
            <div>
                <Box sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Тэмдэглэгээ
                    <IconButton
                        onClick={() => {
                            setEditMode(!editMode);
                        }}
                    >
                        <AddCircleOutlineIcon
                            style={{
                                transform: editMode
                                    ? "rotate(45deg)"
                                    : "rotate(0deg)",
                                transition: "transform 0.8s",
                            }}
                        />
                    </IconButton>
                </Box>
            </div>

            {editMode && (
                <RemarkNew
                    TransactionID={TransactionID}
                    setEditMode={setEditMode}
                />
            )}

            {data.map((remark: any, index: number) => {
                return (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <p
                            style={{
                                marginRight: 20,
                                color: "#a0a0a0",
                                fontSize: "0.8rem",
                            }}
                        >
                            {remark.UserName}:
                        </p>
                        <p
                            style={{
                                flexGrow: "1",
                                fontSize: "0.9rem",
                            }}
                        >
                            {remark.Remarks}
                        </p>
                        <p
                            style={{
                                fontSize: "0.8rem",
                                textAlign: "right",
                                color: "#a0a0a0",
                                marginLeft: 20,
                            }}
                        >
                            {fToCustom(remark.CreatedDate, "dd/MMM hh:kk")}
                        </p>
                    </div>
                );
            })}
        </>
    );
};

export default RemarkList;
