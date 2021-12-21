import Typography from "@mui/material/Typography";

import RoomTypeList from "components/room/type/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Өрөөний төрөл
            </Typography>

            <RoomTypeList />
        </>
    );
};

export default Index;
