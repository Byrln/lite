import {useState} from "react";
import {Box} from "@mui/material";
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {fToCustom} from "lib/utils/format-time";
import Button from "@mui/material/Button";
import {RoomBlockAPI} from "lib/api/room-block";
import RoomBlockForm from "components/room/block/new-edit";

const ItemDetail = ({itemInfo}: any) => {
    const [actionMode, setActionMode] = useState("view");

    const updateStatus = async (evt: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        let values = {
            RoomBlockID: itemInfo.RoomBlockID,
            Status: !itemInfo.Status,
        };
        let res = await RoomBlockAPI.updateStatus(itemInfo.RoomBlockID, values);
        console.log(res);
    };


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>{itemInfo.detail.RoomBlockID}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Room</TableCell>
                                <TableCell>{`${itemInfo.detail.RoomTypeName} (${itemInfo.detail.RoomFullName})`}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Status</TableCell>
                                <TableCell>{itemInfo.detail.Status ? "active" : "inactive"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Duration</TableCell>
                                <TableCell>{`${fToCustom(itemInfo.detail.BeginDate, 'yyyy-MM-dd')} ~ ${fToCustom(itemInfo.detail.EndDate, 'yyyy-MM-dd')}`}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Created</TableCell>
                                <TableCell>{`${itemInfo.detail.UserName} (${fToCustom(itemInfo.detail.CreatedDate, 'yyyy-MM-dd hh:kk')})`}</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={6}>

                    <Button
                        variant={"text"}
                        onClick={updateStatus}
                    >{itemInfo.detail.Status ? "disable" : "enable"}</Button>

                    <Button
                        variant={"text"}
                        onClick={(evt: any) => {
                            setActionMode("edit");
                        }}
                    >Edit</Button>

                    {
                        actionMode === "edit" &&
                        <RoomBlockForm
                            defaultEntity={itemInfo.detail}
                        />
                    }

                </Grid>
            </Grid>
        </>
    );
};
export default ItemDetail;

