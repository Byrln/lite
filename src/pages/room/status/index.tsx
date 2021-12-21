import Typography from "@mui/material/Typography";
import RoomStatusList from "../../../components/room/status/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Өрөөний төлөв
            </Typography>
            <RoomStatusList />
        </>
    );
};

export default Index;
