import {useState} from "react";
import {Box} from "@mui/material";
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {fToCustom} from "lib/utils/format-time";
import Button from "@mui/material/Button";
import {RoomBlockAPI, listUrl} from "lib/api/room-block";
import RoomBlockForm from "components/room/block/new-edit";
import {mutate} from "swr";

const ItemDetail = ({itemInfo, getRoomBlockDetail}: any) => {
    const [roomBlock, setRoomBlock] = useState({...itemInfo.detail});
    const [actionMode, setActionMode] = useState("view");

    const updateStatus = async (evt: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        let newStatus = !roomBlock.Status;
        let values = {
            RoomBlockID: itemInfo.detail.RoomBlockID,
            Status: newStatus,
        };
        let res = await RoomBlockAPI.updateStatus(itemInfo.RoomBlockID, values);
        await mutate(listUrl);

        setRoomBlock({
            ...roomBlock,
            Status: newStatus,
        });

    };


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>{roomBlock.RoomBlockID}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Room</TableCell>
                                <TableCell>{`${roomBlock.RoomTypeName} (${roomBlock.RoomFullName})`}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Status</TableCell>
                                <TableCell>{roomBlock.Status ? "active" : "inactive"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Duration</TableCell>
                                <TableCell>{`${fToCustom(roomBlock.BeginDate, 'yyyy-MM-dd')} ~ ${fToCustom(roomBlock.EndDate, 'yyyy-MM-dd')}`}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Created</TableCell>
                                <TableCell>{`${roomBlock.UserName} (${fToCustom(roomBlock.CreatedDate, 'yyyy-MM-dd hh:kk')})`}</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={6}>

                    <Button
                        variant={"text"}
                        onClick={updateStatus}
                    >{roomBlock.Status ? "disable" : "enable"}</Button>

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

