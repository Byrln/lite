import {useState} from "react";
import {ReservationRemarkSWR} from "lib/api/reservation-remark";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {fToCustom} from "../../../lib/utils/format-time";
import {IconButton} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import RemarkNew from "./new";

const RemarkList = ({TransactionID}: any) => {
    const {data, error} = ReservationRemarkSWR(TransactionID);
    const [editMode, setEditMode] = useState(false);

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{width: "100%"}}>
                <Skeleton/>
                <Skeleton animation="wave"/>
                <Skeleton animation={false}/>
            </Box>
        );

    return (
        <>
            <div>
                Reservation Remark List
                <IconButton
                    onClick={() => {
                        setEditMode(true);
                    }}
                ><AddCircleOutlineIcon/></IconButton>
            </div>
            {
                !editMode &&
                <>
                    {data.map((remark: any, index: number) => {
                        return (
                            <div key={index}>
                                <p>
                                    <span style={{marginRight: 5}}>{remark.UserName}:</span>
                                    <span>{remark.Remarks}</span>
                                </p>
                                <p style={{textAlign: "right"}}>{fToCustom(remark.CreatedDate, "dd/MMM hh:kk")}</p>
                            </div>
                        )
                    })}
                </>
            }
            {
                editMode &&
                <RemarkNew
                    TransactionID={TransactionID}
                    setEditMode={setEditMode}
                />
            }
        </>
    );
};

export default RemarkList;